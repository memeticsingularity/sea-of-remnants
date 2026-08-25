import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCollection, invalidate } from '@/hooks/useCollection'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import type { GlossaryEntry } from '@/types'
import { Card } from '@/components/ui/Card'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'

export function GlossaryPage() {
  const location = useLocation()
  const [query, setQuery] = useState('')
  const { status, data, error } = useCollection<GlossaryEntry>('glossary')
  const entries = data ?? []

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (entry) =>
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.related?.some((term) => term.toLowerCase().includes(q)),
    )
  }, [query, entries])

  // 根据 URL hash 滚动到对应术语；若当前搜索筛选导致目标不可见，则清空搜索
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (!hash) return

    const target = entries.find((g) => g.id === hash)
    if (!target) return

    const isVisible = filteredEntries.some((entry) => entry.id === hash)
    if (!isVisible) {
      setQuery('')
      return
    }

    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash, filteredEntries, entries])

  if (status === 'loading') return <Skeleton />
  if (status === 'error') return <ErrorState error={error} onRetry={() => invalidate('glossary')} />

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-text">术语表</h1>

      <Card className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索术语、解释或相关词…"
          className="w-full rounded-md border border-border bg-surface px-4 py-2 text-text placeholder:text-text-dim focus:border-accent-cyan focus:outline-none"
        />
      </Card>

      {filteredEntries.length === 0 ? (
        <Card>
          <p className="text-text-muted">没有找到匹配的术语。</p>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-text-muted">共 {filteredEntries.length} 条术语</p>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} id={entry.id}>
                <Card>
                  <h2 className="mb-2 text-xl font-bold text-accent-cyan">{entry.term}</h2>
                  <p className="mb-3 text-text">
                    <GlossaryTooltip text={entry.definition} />
                  </p>
                  {entry.related && entry.related.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-text-muted">相关：</span>
                      {entry.related.map((term) => {
                        const related = entries.find((g) => g.term === term)
                        return related ? (
                          <Link
                            key={term}
                            to={`/glossary#${related.id}`}
                            className="text-sm text-accent-cyan hover:underline"
                          >
                            {term}
                          </Link>
                        ) : (
                          <span key={term} className="text-sm text-text-muted">{term}</span>
                        )
                      })}
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
