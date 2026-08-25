import { useEffect, useRef, useState } from 'react'
import { ApiError } from '@/api/client'
import {
  fetchCollection,
  fetchCrewSummaries,
  fetchEntity,
  fetchSearch,
  fetchStats,
  fetchSkillOwners,
  type HomeStats,
  type SkillOwners,
} from '@/api/content'

export type Status = 'loading' | 'ready' | 'error' | 'notfound'

export interface UseDataResult<T> {
  status: Status
  data?: T
  error?: Error
}

/**
 * 单飞 Promise 缓存：多个组件 / StrictMode 双挂载共享同一请求，
 * 请求失败不缓存，便于重试。
 */
const cache = new Map<string, Promise<unknown>>()

function getOrFetch<T>(cacheKey: string, fetcher: () => Promise<T>): Promise<T> {
  let p = cache.get(cacheKey) as Promise<T> | undefined
  if (!p) {
    p = fetcher().catch((err) => {
      cache.delete(cacheKey)
      throw err
    })
    cache.set(cacheKey, p)
  }
  return p
}

/** 使某个 key 的缓存失效，下次访问重新请求 */
export function invalidate(cacheKey: string) {
  cache.delete(cacheKey)
}

function useData<T>(
  cacheKey: string,
  makePromise: () => Promise<T>,
  enabled = true,
): UseDataResult<T> {
  const [state, setState] = useState<UseDataResult<T>>({ status: 'loading' })
  const makeRef = useRef(makePromise)
  makeRef.current = makePromise

  useEffect(() => {
    let alive = true
    if (!enabled) {
      setState({ status: 'loading' })
      return
    }
    setState({ status: 'loading' })
    makeRef
      .current()
      .then((data) => {
        if (alive) setState({ status: 'ready', data })
      })
      .catch((err) => {
        if (!alive) return
        const e =
          err instanceof ApiError ? err : new ApiError(500, String(err?.message ?? err))
        setState({ status: e.code === 404 ? 'notfound' : 'error', error: e })
      })
    return () => {
      alive = false
    }
  }, [cacheKey, enabled])

  return state
}

/** 整集合数据 */
export function useCollection<T>(key: string, enabled = true): UseDataResult<T[]> {
  return useData<T[]>(key, () => getOrFetch(key, () => fetchCollection<T>(key)), enabled)
}

/** 单个实体（按 slug）；404 时 status 为 notfound */
export function useEntity<T>(
  key: string,
  slug: string | undefined,
  enabled = true,
): UseDataResult<T> {
  const cacheKey = `${key}/${slug ?? ''}`
  return useData<T>(
    cacheKey,
    () => getOrFetch(cacheKey, () => fetchEntity<T>(key, slug ?? '')),
    enabled,
  )
}

/** 船员摘要（列表/浮窗/选择器使用，避免拉全量 Crew） */
export function useCrewSummaries(enabled = true) {
  return useData(
    'crews/summary',
    () => getOrFetch('crews/summary', fetchCrewSummaries),
    enabled,
  )
}

/** 首页入口统计 */
export function useStats(enabled = true): UseDataResult<HomeStats> {
  return useData<HomeStats>('stats', () => getOrFetch('stats', fetchStats), enabled)
}

/** 搜索索引 */
export function useSearch(enabled = true) {
  return useData('search', () => getOrFetch('search', fetchSearch), enabled)
}

/** 技能/骰子所属角色与职业（聚合接口 /sor/api/skills/{slug}/owners） */
export function useSkillOwners(
  slug: string | undefined,
  enabled = true,
): UseDataResult<SkillOwners> {
  const cacheKey = `skills/${slug ?? ''}/owners`
  return useData<SkillOwners>(
    cacheKey,
    () => getOrFetch(cacheKey, () => fetchSkillOwners(slug ?? '')),
    enabled,
  )
}
