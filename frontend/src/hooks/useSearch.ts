import { useMemo, useEffect } from 'react'
import Fuse from 'fuse.js'
import { wikiData } from '@/data'

const fuse = new Fuse(wikiData.searchIndex, {
  keys: ['title', 'tags', 'keywords'],
  threshold: 0.35,
  includeScore: true,
})

export function useSearch(query: string, limit = 10) {
  return useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query, { limit }).map((result) => result.item)
  }, [query, limit])
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
