import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { evaluateGuardianTrigger } from '@/utils/partyMatch'
import { GuardianCard } from './GuardianCard'
import type { Guardian } from '@/types'

type FilterMode = 'all' | 'owned' | 'missing'
type GuardianCategory = '战技特化' | '潜能特化' | '船员培养'
type RarityFilter = 'all' | '金' | '紫' | '蓝'

interface GuardianCollectionGridProps {
  guardians: Guardian[]
  ownedIds: string[]
  onToggleOwned: (id: string) => void
  partyAttrs?: string[]
  activeCategory: GuardianCategory
}

const RARITY_OPTIONS: { key: RarityFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: '金', label: '金' },
  { key: '紫', label: '紫' },
  { key: '蓝', label: '蓝' },
]

export function GuardianCollectionGrid({
  guardians,
  ownedIds,
  onToggleOwned,
  partyAttrs,
  activeCategory,
}: GuardianCollectionGridProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all')
  const [onlyTrigger, setOnlyTrigger] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return guardians.filter((g) => {
      if (g.category !== activeCategory) return false
      if (filterMode === 'owned' && !ownedIds.includes(g.id)) return false
      if (filterMode === 'missing' && ownedIds.includes(g.id)) return false
      if (rarityFilter !== 'all' && g.rarity !== rarityFilter) return false
      if (query && !g.name.toLowerCase().includes(query)) return false
      if (onlyTrigger && partyAttrs) {
        const { trigger } = evaluateGuardianTrigger(g.effect, partyAttrs)
        if (!trigger) return false
      }
      return true
    })
  }, [
    guardians,
    activeCategory,
    filterMode,
    rarityFilter,
    searchQuery,
    ownedIds,
    onlyTrigger,
    partyAttrs,
  ])

  const ownedInCategory = filtered.filter((g) => ownedIds.includes(g.id)).length

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-bold text-text">{activeCategory} 图鉴</h2>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'owned', 'missing'] as FilterMode[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterMode(key)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                filterMode === key
                  ? 'bg-accent text-white'
                  : 'bg-surface-light text-text-muted hover:text-text'
              }`}
            >
              {key === 'all' ? '全部' : key === 'owned' ? '已拥有' : '未拥有'}
            </button>
          ))}
          {partyAttrs && (
            <button
              type="button"
              onClick={() => setOnlyTrigger((prev) => !prev)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                onlyTrigger
                  ? 'bg-positive text-white'
                  : 'bg-surface-light text-text-muted hover:text-text'
              }`}
            >
              {onlyTrigger ? '仅看可触发' : '只看可触发'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {RARITY_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRarityFilter(opt.key)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              rarityFilter === opt.key
                ? 'bg-surface-light text-accent'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索守护名称…"
          className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
        />
      </div>

      <p className="text-sm text-text-muted">
        已拥有 {ownedInCategory} / {filtered.length}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((g) => (
            <GuardianCard
              key={g.id}
              guardian={g}
              owned={ownedIds.includes(g.id)}
              onToggleOwned={onToggleOwned}
              partyAttrs={partyAttrs}
            />
          ))}
        </div>
      ) : (
        <p className="text-text-muted">
          当前筛选条件下没有守护。
          {filterMode === 'owned' ? '先标记一些已拥有的守护吧。' : ''}
        </p>
      )}
    </Card>
  )
}
