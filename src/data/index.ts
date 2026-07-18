import type { WikiData } from '@/types'
import generated from './generated.json'

/**
 * 前端使用的统一 Wiki 数据集
 *
 * 由 scripts/build-content.js 从 content/ 目录生成，
 * 包含船员、技能、行装、术语等所有内容。
 */
export const wikiData = generated as WikiData

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
