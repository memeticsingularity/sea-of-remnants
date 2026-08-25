/**
 * 前端数据层纯函数工具
 *
 * 集合内容不再在此处提供——各页面/组件统一通过 `@/hooks/useCollection`
 * 从后端 `/api/*` 按需获取。本文件只保留对已加载数组的纯操作函数。
 */

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
