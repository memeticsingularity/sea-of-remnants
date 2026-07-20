import { useCallback, useMemo } from 'react'
import { wikiData } from '@/data'
import type { RecruitmentPool, RecruitmentTier } from '@/types'
import type { GachaResult, GachaState } from './useGachaState'

export interface PullOutcome {
  results: GachaResult[]
  nextState: GachaState
  cost: number
}

function isMemoryPool(pool: RecruitmentPool) {
  return pool.slug.endsWith('-memory')
}

export function useGachaEngine(pool: RecruitmentPool | undefined) {
  const data = wikiData

  const getName = useCallback(
    (id: string, type: 'crew' | 'shadow'): string => {
      if (type === 'crew') {
        const crew = data.crews.find((c) => c.id === id)
        return crew?.name ?? id
      }
      const shadow = data.shadows.find((s) => s.id === id)
      return shadow?.name ?? id
    },
    [data],
  )

  const pickFromList = useCallback(
    (
      ids: string[],
      type: 'crew' | 'shadow',
      upGuarantee: boolean,
      tier: 'black' | 'purple' | 'blue',
    ): { id: string; name: string; isUp: boolean } => {
      if (ids.length === 0) {
        throw new Error(`Empty pool for ${type} tier ${tier}`)
      }

      const ups =
        pool?.upItems
          .flatMap((u) =>
            (type === 'crew' ? u.crewIds || [] : u.shadowIds || []).map((id) => ({
              id,
              group: u,
            })),
          )
          .filter((u) => ids.includes(u.id)) ?? []

      // First black pull guarantee for 织梦弦音
      if (tier === 'black' && !pool?.upItems.length && pool?.pityRules.some((r) => r.firstUpId)) {
        // handled by caller
      }

      if (upGuarantee && ups.length > 0) {
        const id = ups[Math.floor(Math.random() * ups.length)].id
        return { id, name: getName(id, type), isUp: true }
      }

      if (ups.length > 0) {
        const upRate = ups[0].group.upRate ?? 0.5
        if (Math.random() < upRate) {
          const id = ups[Math.floor(Math.random() * ups.length)].id
          return { id, name: getName(id, type), isUp: true }
        }
      }

      const nonUpIds = ids.filter((id) => !ups.some((u) => u.id === id))
      const poolIds = nonUpIds.length > 0 ? nonUpIds : ids
      const id = poolIds[Math.floor(Math.random() * poolIds.length)]
      return { id, name: getName(id, type), isUp: false }
    },
    [pool, getName],
  )

  const pickBlackCrew = useCallback(
    (
      tierConfig: RecruitmentTier,
      upGuarantee: boolean,
    ): { type: 'crew' | 'shadow'; id: string; name: string; isUp: boolean } => {
      const ids = tierConfig.pool.crewIds
      if (ids.length === 0) {
        throw new Error('No black crew in memory pool')
      }
      const pick = pickFromList(ids, 'crew', upGuarantee, 'black')
      return { type: 'crew', ...pick }
    },
    [pickFromList],
  )

  const pickFromTier = useCallback(
    (
      tierConfig: RecruitmentTier,
      upGuarantee: boolean,
      isFirstBlack: boolean,
    ): { type: 'crew' | 'shadow'; id: string; name: string; isUp: boolean } => {
      const { key, pool: poolRef, mixed } = tierConfig

      // First black pity special rule for 织梦弦音
      if (key === 'black' && isFirstBlack) {
        const firstUpId = pool?.pityRules.find((r) => r.tier === 'black' && r.firstUpId)?.firstUpId
        if (firstUpId) {
          const type: 'crew' | 'shadow' = data.crews.some((c) => c.id === firstUpId) ? 'crew' : 'shadow'
          return { type, id: firstUpId, name: getName(firstUpId, type), isUp: true }
        }
      }

      if (mixed && key === 'purple') {
        const isCrew = Math.random() < 0.5
        const ids = isCrew ? poolRef.crewIds : poolRef.shadowIds
        const type: 'crew' | 'shadow' = isCrew ? 'crew' : 'shadow'
        const pick = pickFromList(ids, type, upGuarantee, key)
        return { type, ...pick }
      }

      // For black tier in 这里不散场, split 50/50 between crew and shadow
      if (key === 'black' && poolRef.crewIds.length > 0 && poolRef.shadowIds.length > 0 && !mixed) {
        const isCrew = Math.random() < 0.5
        const ids = isCrew ? poolRef.crewIds : poolRef.shadowIds
        const type: 'crew' | 'shadow' = isCrew ? 'crew' : 'shadow'
        const pick = pickFromList(ids, type, upGuarantee, key)
        return { type, ...pick }
      }

      const type: 'crew' | 'shadow' = poolRef.crewIds.length > 0 ? 'crew' : 'shadow'
      const ids = type === 'crew' ? poolRef.crewIds : poolRef.shadowIds
      const pick = pickFromList(ids, type, upGuarantee, key)
      return { type, ...pick }
    },
    [pool, data, pickFromList, getName],
  )

  const resolveMemoryPull = useCallback(
    (
      currentState: GachaState,
      pullIndex: number,
    ): { result: GachaResult; nextState: GachaState } => {
      if (!pool) throw new Error('No pool selected')

      const nextState: GachaState = {
        ...currentState,
        blackPity: currentState.blackPity + 1,
        blackCrewPity: currentState.blackCrewPity + 1,
      }

      const blackTier = pool.tiers.find((t) => t.key === 'black')
      const purpleTier = pool.tiers.find((t) => t.key === 'purple')

      if (!blackTier || !purpleTier) {
        throw new Error('Memory pool requires black and purple tiers')
      }

      // 9-week black crew guarantee
      if (nextState.blackCrewPity >= 9) {
        const pick = pickBlackCrew(blackTier, nextState.blackUpGuarantee)
        nextState.blackPity = 0
        nextState.blackCrewPity = 0
        nextState.firstBlackPulled = true
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      // 3-week black guarantee
      if (nextState.blackPity >= 3) {
        const pick = pickFromTier(blackTier, nextState.blackUpGuarantee, !nextState.firstBlackPulled)
        nextState.blackPity = 0
        if (pick.type === 'crew') nextState.blackCrewPity = 0
        nextState.firstBlackPulled = true
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      const roll = Math.random()
      if (roll < blackTier.baseRate) {
        const pick = pickFromTier(blackTier, nextState.blackUpGuarantee, !nextState.firstBlackPulled)
        nextState.blackPity = 0
        if (pick.type === 'crew') nextState.blackCrewPity = 0
        nextState.firstBlackPulled = true
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      // Purple result
      const pick = pickFromTier(purpleTier, false, false)
      return {
        result: wrapResult(pick, pool, pullIndex),
        nextState,
      }
    },
    [pool, pickFromTier, pickBlackCrew],
  )

  const pullSingle = useCallback(
    (
      currentState: GachaState,
      pullIndex: number,
    ): { result: GachaResult; nextState: GachaState } => {
      if (!pool) throw new Error('No pool selected')

      if (isMemoryPool(pool)) {
        return resolveMemoryPull(currentState, pullIndex)
      }

      const nextState: GachaState = {
        ...currentState,
        blackPity: currentState.blackPity + 1,
        purplePity: currentState.purplePity + 1,
      }

      const blackTier = pool.tiers.find((t) => t.key === 'black')
      const purpleTier = pool.tiers.find((t) => t.key === 'purple')
      const blueTier = pool.tiers.find((t) => t.key === 'blue')

      // Black hard pity
      if (blackTier && nextState.blackPity >= (blackTier.hardPity ?? 80)) {
        const pick = pickFromTier(blackTier, nextState.blackUpGuarantee, !nextState.firstBlackPulled)
        nextState.blackPity = 0
        nextState.firstBlackPulled = true
        nextState.blackUpGuarantee = !pick.isUp && pool.pityRules.some(
          (r) => r.tier === 'black' && r.guaranteeUpAfterMiss,
        )
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      // Purple hard pity
      if (purpleTier && nextState.purplePity >= (purpleTier.hardPity ?? 10)) {
        const pick = pickFromTier(purpleTier, nextState.purpleUpGuarantee, false)
        nextState.purplePity = 0
        nextState.purpleUpGuarantee = !pick.isUp && pool.pityRules.some(
          (r) => r.tier === 'purple' && r.guaranteeUpAfterMiss,
        )
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      const roll = Math.random()
      const blackRate = blackTier?.baseRate ?? 0
      const purpleRate = purpleTier?.baseRate ?? 0

      if (blackTier && roll < blackRate) {
        const pick = pickFromTier(blackTier, nextState.blackUpGuarantee, !nextState.firstBlackPulled)
        nextState.blackPity = 0
        nextState.firstBlackPulled = true
        nextState.blackUpGuarantee = !pick.isUp && pool.pityRules.some(
          (r) => r.tier === 'black' && r.guaranteeUpAfterMiss,
        )
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      if (purpleTier && roll < blackRate + purpleRate) {
        const pick = pickFromTier(purpleTier, nextState.purpleUpGuarantee, false)
        nextState.purplePity = 0
        nextState.purpleUpGuarantee = !pick.isUp && pool.pityRules.some(
          (r) => r.tier === 'purple' && r.guaranteeUpAfterMiss,
        )
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      // Blue fallback
      if (blueTier) {
        const pick = pickFromTier(blueTier, false, false)
        return {
          result: wrapResult(pick, pool, pullIndex),
          nextState,
        }
      }

      // Should not reach here if pool is well-formed
      throw new Error('Unable to resolve pull')
    },
    [pool, pickFromTier, resolveMemoryPull],
  )

  const pullTen = useCallback(
    (currentState: GachaState): PullOutcome => {
      if (!pool) return { results: [], nextState: currentState, cost: 0 }

      const results: GachaResult[] = []
      let state = currentState
      for (let i = 0; i < 10; i++) {
        const { result, nextState } = pullSingle(state, i + 1)
        results.push(result)
        state = nextState
      }
      state.totalSpent += pool.tenCost
      return { results, nextState: state, cost: pool.tenCost }
    },
    [pool, pullSingle],
  )

  const pullOne = useCallback(
    (currentState: GachaState): PullOutcome => {
      if (!pool) return { results: [], nextState: currentState, cost: 0 }

      const { result, nextState } = pullSingle(currentState, 1)
      const state = { ...nextState, totalSpent: nextState.totalSpent + pool.singleCost }
      return { results: [result], nextState: state, cost: pool.singleCost }
    },
    [pool, pullSingle],
  )

  return useMemo(
    () => ({
      canPull: !!pool && pool.tiers.length > 0,
      pullOne,
      pullTen,
    }),
    [pool, pullOne, pullTen],
  )
}

function wrapResult(
  pick: { type: 'crew' | 'shadow'; id: string; name: string; isUp: boolean },
  pool: RecruitmentPool,
  pullIndex: number,
): GachaResult {
  return {
    id: pick.id,
    type: pick.type,
    name: pick.name,
    rarity: inferRarity(pool, pick.id),
    isUp: pick.isUp,
    poolId: pool.id,
    poolName: pool.name,
    timestamp: Date.now(),
    pullIndex,
  }
}

function inferRarity(pool: RecruitmentPool, id: string): 'black' | 'purple' | 'blue' {
  for (const tier of pool.tiers) {
    if (tier.pool.crewIds.includes(id) || tier.pool.shadowIds.includes(id)) {
      return tier.key
    }
  }
  return 'blue'
}
