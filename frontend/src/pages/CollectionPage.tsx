import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CollectionItemCard } from '@/components/recruitment/CollectionItemCard'
import { useGachaHistory } from '@/hooks/useGachaState'
import { useCollectionStats, type CollectionItem } from '@/hooks/useCollectionStats'

type FilterMode = 'all' | 'owned' | 'missing'
type RarityFilter = 'all' | 'black' | 'purple' | 'blue'
type TypeTab = 'crew' | 'shadow'

const RARITY_OPTIONS: { key: RarityFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'black', label: '黑券' },
  { key: 'purple', label: '紫券' },
  { key: 'blue', label: '蓝券' },
]

const TYPE_OPTIONS: { key: TypeTab; label: string }[] = [
  { key: 'crew', label: '船员' },
  { key: 'shadow', label: '往日之影' },
]

export function CollectionPage() {
  const pools = wikiData.recruitmentPools
  const { history } = useGachaHistory()

  const [poolId, setPoolId] = useState<string>('all')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState<TypeTab>('crew')

  const collection = useCollectionStats(history, poolId)

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return collection.filter((item: CollectionItem) => {
      if (filterMode === 'owned' && item.pulledCount === 0) return false
      if (filterMode === 'missing' && item.pulledCount > 0) return false
      if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false
      if (query && !item.name.toLowerCase().includes(query)) return false
      return true
    })
  }, [collection, filterMode, rarityFilter, searchQuery])

  const activeItems = filtered.filter((item) => item.type === activeType)

  const ownedCount = collection.filter((item) => item.pulledCount > 0).length
  const activeOwnedCount = activeItems.filter((item) => item.pulledCount > 0).length

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '招募', to: '/recruitment' },
          { label: '招募图鉴' },
        ]}
      />
      <h1 className="text-3xl font-bold text-text">招募图鉴</h1>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="collection-pool-select" className="text-sm text-text-muted">
                招募池
              </label>
              <select
                id="collection-pool-select"
                value={poolId}
                onChange={(e) => setPoolId(e.target.value)}
                className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text"
              >
                <option value="all">全部招募池</option>
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {RARITY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setRarityFilter(opt.key)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    rarityFilter === opt.key
                      ? 'bg-accent text-white'
                      : 'bg-surface-light text-text-muted hover:text-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
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
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索船员或往日之影…"
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
            />
          </div>

          <p className="text-sm text-text-muted">
            已拥有 {ownedCount} / {collection.length}（当前页签 {activeOwnedCount} / {activeItems.length}）
          </p>
        </div>
      </Card>

      <div className="flex border-b border-border"
      >
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setActiveType(opt.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeType === opt.key
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {activeItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {activeItems.map((item) => (
            <CollectionItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              slug={item.slug}
              image={item.image}
              rarity={item.rarity}
              type={item.type}
              pulledCount={item.pulledCount}
            />
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-text-muted">
            当前筛选条件下没有可显示的
            {activeType === 'crew' ? '船员' : '往日之影'}。
            {filterMode === 'owned' ? '去招募模拟器抽几发再来查看吧。' : ''}
          </p>
        </Card>
      )}
    </div>
  )
}
