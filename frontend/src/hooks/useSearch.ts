import { useMemo, useEffect } from 'react'
import Fuse from 'fuse.js'
import { useCollection } from '@/hooks/useCollection'
import type { SearchIndexEntry } from '@/types'

export function useSearch(query: string, limit = 10) {
  const { data: index, status } = useCollection<SearchIndexEntry>('searchIndex')
  const fuse = useMemo(
    () =>
      index && status === 'ready'
        ? new Fuse(index, {
            keys: ['title', 'tags', 'keywords'],
            threshold: 0.35,
            includeScore: true,
          })
        : null,
    [index, status],
  )
  return useMemo(() => {
    if (!query.trim()) return []
    if (!fuse) return []
    return fuse.search(query, { limit }).map((result) => result.item)
  }, [query, limit, fuse])
}

export function useSearchShortcut(
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputRef])
}
