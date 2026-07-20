import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Trash2, Link2, Link2Off } from 'lucide-react'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  GuardianCollectionGrid,
  computeFilteredIds,
  type GalleryFilters,
} from '@/components/guardians/GuardianCollectionGrid'
import { GuardianCategoryTabs } from '@/components/guardians/GuardianCategoryTabs'
import { LoadoutPanel } from '@/components/guardians/LoadoutPanel'
import { ShipTagStatsPanel } from '@/components/guardians/ShipTagStatsPanel'
import {
  useGuardianState,
  GUARDIAN_CATEGORIES,
  type GuardianCategory,
} from '@/hooks/useGuardianState'
import { usePartyConfig } from '@/hooks/usePartyConfig'

export function FigureheadPrayerPage() {
  const guardians = wikiData.guardians
  const shipTags = wikiData.shipTags
  const crews = wikiData.crews

  const {
    state,
    toggleOwned,
    toggleFocusTag,
    clearOwned,
    equipGuardian,
    unequipGuardian,
    clearLoadouts,
  } = useGuardianState()
  const { config } = usePartyConfig()
  const [loadoutCategory, setLoadoutCategory] = useState<GuardianCategory>('战技特化')
  const [galleryCategory, setGalleryCategory] = useState<GuardianCategory>('战技特化')
  const [linked, setLinked] = useState(true)
  const [galleryFilters, setGalleryFilters] = useState<GalleryFilters>({
    filterMode: 'all',
    rarityFilter: 'all',
    onlyTrigger: false,
    searchQuery: '',
  })

  const partyAttrs = useMemo(
    () =>
      config.slots
        .map((s) => crews.find((c) => c.id === s.crewId)?.primaryStat)
        .filter((a): a is string => !!a && a !== '待补充'),
    [config, crews],
  )

  const galleryFilteredIds = useMemo(
    () =>
      computeFilteredIds(guardians, galleryCategory, state.ownedIds, galleryFilters, partyAttrs),
    [guardians, galleryCategory, state.ownedIds, galleryFilters, partyAttrs],
  )

  const equippedCount = GUARDIAN_CATEGORIES.reduce(
    (sum, category) =>
      sum + state.loadouts[category].filter((id): id is string => id !== null).length,
    0,
  )

  const categoryCounts = useMemo(() => {
    const result: Record<GuardianCategory, number> = {
      战技特化: 0,
      潜能特化: 0,
      船员培养: 0,
    }
    for (const g of guardians) {
      result[g.category] = (result[g.category] || 0) + 1
    }
    return result
  }, [guardians])

  function handleSelectBranch(category: GuardianCategory) {
    setLoadoutCategory(category)
    if (linked) {
      setGalleryCategory(category)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '船首像祈祷' },
        ]}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">船首像祈祷</h1>
          <p className="text-sm text-text-muted">守护图鉴 · 标签统计</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Card className="px-3 py-2">
            <span className="text-sm text-text-muted">已配置守护</span>
            <span className="ml-2 text-lg font-bold text-accent">
              {equippedCount} / 21
            </span>
          </Card>
          <Link
            to="/figurehead-prayer/recommend"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            <HelpCircle className="h-4 w-4" />
            三选一求助
          </Link>
          <button
            type="button"
            onClick={clearLoadouts}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:border-negative hover:text-negative"
          >
            <Trash2 className="h-4 w-4" />
            清空配置
          </button>
          <button
            type="button"
            onClick={clearOwned}
            className="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:border-negative hover:text-negative"
          >
            清空已拥有
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-[repeat(24,minmax(0,1fr))]">
        {/* 左侧：已配置 */}
        <div className="col-span-8">
          <Card className="space-y-2 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-text-muted">选择分支</p>
              <button
                type="button"
                onClick={() => {
                  setLinked((prev) => {
                    const next = !prev
                    if (next) {
                      setGalleryCategory(loadoutCategory)
                    }
                    return next
                  })
                }}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                  linked
                    ? 'bg-positive/10 text-positive'
                    : 'bg-surface-light text-text-muted'
                }`}
                title={linked ? '联动中：左切右跟' : '未联动：左右独立'}
              >
                {linked ? (
                  <>
                    <Link2 className="h-3 w-3" /> 联动
                  </>
                ) : (
                  <>
                    <Link2Off className="h-3 w-3" /> 独立
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {GUARDIAN_CATEGORIES.map((category) => {
                const equipped = state.loadouts[category].filter(
                  (id): id is string => id !== null,
                ).length
                const isActive = category === loadoutCategory
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleSelectBranch(category)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'bg-surface-light text-text-muted hover:text-text'
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive ? 'bg-white/20' : 'bg-surface text-text-dim'
                      }`}
                    >
                      {equipped} / 7
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          <LoadoutPanel
            guardians={guardians}
            loadouts={state.loadouts}
            onEquip={equipGuardian}
            onUnequip={unequipGuardian}
            activeCategory={loadoutCategory}
            galleryFilteredIds={galleryFilteredIds}
          />
        </div>

        {/* 右侧：图鉴 */}
        <div className="space-y-4 col-span-[16]">
          <ShipTagStatsPanel
            ownedIds={state.ownedIds}
            allGuardians={guardians}
            shipTags={shipTags}
            focusTags={state.focusTags}
            onToggleFocusTag={toggleFocusTag}
          />

          {!linked && (
            <Card className="p-2">
              <GuardianCategoryTabs
                active={galleryCategory}
                onSelect={setGalleryCategory}
                counts={categoryCounts}
              />
            </Card>
          )}

          <GuardianCollectionGrid
            guardians={guardians}
            ownedIds={state.ownedIds}
            onToggleOwned={toggleOwned}
            partyAttrs={partyAttrs}
            activeCategory={galleryCategory}
            filters={galleryFilters}
            onFiltersChange={setGalleryFilters}
          />
        </div>
      </div>
    </div>
  )
}
