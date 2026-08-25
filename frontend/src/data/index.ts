import type { WikiData, Crew, GameClass } from '@/types'
import generated from './generated.json'

/**
 * 前端使用的统一 Wiki 数据集
 *
 * 由 scripts/build-content.js 从 content/ 目录生成，
 * 包含船员、技能、行装、术语等所有内容。
 */
export const wikiData = generated as unknown as WikiData

/**
 * 根据 slug 在集合中查找实体
 * @param collection - 实体集合
 * @param slug - URL 友好标识
 */
export function getEntityBySlug<T extends { slug: string }>(
  collection: T[],
  slug: string,
): T | undefined {
  return collection.find((item) => item.slug === slug)
}

/**
 * 根据 id 在集合中查找实体
 * @param collection - 实体集合
 * @param id - 唯一标识
 */
export function getEntityById<T extends { id: string }>(
  collection: T[],
  id: string,
): T | undefined {
  return collection.find((item) => item.id === id)
}

/** 技能/骰子等级相关工具函数 */

type Levelable = { level?: number; maxLevel?: number; levelDetails?: { level: number; detailedDesc: string }[] }

export function getLevelDetailMap(item: Levelable): Map<number, string> {
  const map = new Map<number, string>()
  for (const detail of item.levelDetails || []) {
    map.set(detail.level, detail.detailedDesc)
  }
  return map
}

export function getAvailableLevels(item: Levelable): number[] {
  return (item.levelDetails || [])
    .map((d) => d.level)
    .filter((lv): lv is number => typeof lv === 'number')
    .sort((a, b) => a - b)
}

export function getMaxSkillLevel(item: Levelable): number {
  if (item.maxLevel) return item.maxLevel
  const levels = getAvailableLevels(item)
  return levels.length > 0 ? levels[levels.length - 1] : 1
}

export function getEffectAtLevel(item: Levelable, level: number): string | undefined {
  return getLevelDetailMap(item).get(level)
}

/** 查找持有某个技能的船员与职业 */

export function getSkillOwners(skillId: string): { crews: Crew[]; classes: GameClass[] } {
  const crews = wikiData.crews.filter((c) => c.skills?.includes(skillId))
  const classes = wikiData.classes.filter((c) => c.skills?.includes(skillId))
  return { crews, classes }
}
