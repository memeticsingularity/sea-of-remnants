import { useMemo } from 'react'
import type { GachaResult } from '@/hooks/useGachaState'
import type { Crew, Shadow, RecruitmentPool } from '@/types'

export type CollectionEntityType = 'crew' | 'shadow'

export interface CollectionItem {
  id: string
  type: CollectionEntityType
  rarity: 'black' | 'purple' | 'blue'
  name: string
  slug: string
  image?: string
  pulledCount: number
  poolIds: string[]
}

const RARITY_ORDER: Record<'black' | 'purple' | 'blue', number> = {
  black: 0,
  purple: 1,
  blue: 2,
}

function higherRarity(
  a: 'black' | 'purple' | 'blue',
  b: 'black' | 'purple' | 'blue',
): 'black' | 'purple' | 'blue' {
  return RARITY_ORDER[a] < RARITY_ORDER[b] ? a : b
}

export function useCollectionStats(
  history: GachaResult[],
  poolId: string = 'all',
  data: { pools: RecruitmentPool[]; crews: Crew[]; shadows: Shadow[] },
) {
  return useMemo<CollectionItem[]>(() => {
    const pools =
      poolId === 'all'
        ? data.pools
        : data.pools.filter((p) => p.id === poolId)

    const entityMap = new Map<
      string,
      {
        type: CollectionEntityType
        rarity: 'black' | 'purple' | 'blue'
        poolIds: Set<string>
      }
    >()

    for (const pool of pools) {
      // 先按 tier 确定稀有度，这是唯一可信的稀有度来源
      for (const tier of pool.tiers) {
        const rarity = tier.key
        for (const id of tier.pool.crewIds ?? []) {
          const existing = entityMap.get(id)
          if (existing) {
            existing.rarity = higherRarity(existing.rarity, rarity)
            existing.poolIds.add(pool.id)
          } else {
            entityMap.set(id, { type: 'crew', rarity, poolIds: new Set([pool.id]) })
          }
        }
        for (const id of tier.pool.shadowIds ?? []) {
          const existing = entityMap.get(id)
          if (existing) {
            existing.rarity = higherRarity(existing.rarity, rarity)
            existing.poolIds.add(pool.id)
          } else {
            entityMap.set(id, { type: 'shadow', rarity, poolIds: new Set([pool.id]) })
          }
        }
      }

      // upItems 仅用于补充 pool 归属，不决定稀有度
      for (const up of pool.upItems) {
        for (const id of up.crewIds ?? []) {
          const existing = entityMap.get(id)
          if (existing) {
            existing.poolIds.add(pool.id)
          } else {
            entityMap.set(id, { type: 'crew', rarity: 'black', poolIds: new Set([pool.id]) })
          }
        }
        for (const id of up.shadowIds ?? []) {
          const existing = entityMap.get(id)
          if (existing) {
            existing.poolIds.add(pool.id)
          } else {
            entityMap.set(id, { type: 'shadow', rarity: 'black', poolIds: new Set([pool.id]) })
          }
        }
      }
    }

    const filteredHistory =
      poolId === 'all' ? history : history.filter((h) => h.poolId === poolId)

    const counts = new Map<string, number>()
    for (const h of filteredHistory) {
      counts.set(h.id, (counts.get(h.id) || 0) + 1)
    }

    const result: CollectionItem[] = []
    for (const [id, meta] of entityMap) {
      const entity =
        meta.type === 'crew'
          ? data.crews.find((c) => c.id === id)
          : data.shadows.find((s) => s.id === id)

      if (!entity) continue

      result.push({
        id,
        type: meta.type,
        rarity: meta.rarity,
        name: entity.name,
        slug: entity.slug,
        image: entity.image,
        pulledCount: counts.get(id) || 0,
        poolIds: Array.from(meta.poolIds),
      })
    }

    result.sort((a, b) => {
      if (RARITY_ORDER[a.rarity] !== RARITY_ORDER[b.rarity]) {
        return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]
      }
      return a.name.localeCompare(b.name, 'zh-CN')
    })

    return result
  }, [history, poolId, data])
}
