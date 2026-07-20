import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Trash2 } from 'lucide-react'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GuardianCollectionGrid } from '@/components/guardians/GuardianCollectionGrid'
import { ShipTagStatsPanel } from '@/components/guardians/ShipTagStatsPanel'
import { LoadoutPanel } from '@/components/guardians/LoadoutPanel'
import {
  useGuardianState,
  GUARDIAN_CATEGORIES,
  type GuardianCategory,
} from '@/hooks/useGuardianState'
import { usePartyConfig } from '@/hooks/usePartyConfig'

const categoryLabels: Record<GuardianCategory, string> = {
  战技特化: '战技特化',
  潜能特化: '潜能特化',
  船员培养: '船员培养',
}

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
  const [activeCategory, setActiveCategory] = useState<GuardianCategory>('战技特化')

  const equippedCount = GUARDIAN_CATEGORIES.reduce(
    (sum, category) =>
      sum + state.loadouts[category].filter((id): id is string => id !== null).length,
    0,
  )

  const partyAttrs = useMemo(
    () =>
      config.slots
        .map((s) => crews.find((c) => c.id === s.crewId)?.primaryStat)
        .filter((a): a is string => !!a && a !== '待补充'),
    [config, crews],
  )

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <Card className="space-y-2 p-3">
            <p className="text-xs font-medium text-text-muted">选择分支</p>
            <div className="flex flex-col gap-1">
              {GUARDIAN_CATEGORIES.map((category) => {
                const equipped = state.loadouts[category].filter(
                  (id): id is string => id !== null,
                ).length
                const isActive = category === activeCategory
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'bg-surface-light text-text-muted hover:text-text'
                    }`}
                  >
                    <span>{categoryLabels[category]}</span>
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
            activeCategory={activeCategory}
          />
        </div>

        <div className="space-y-4 lg:col-span-8">
          <ShipTagStatsPanel
            ownedIds={state.ownedIds}
            allGuardians={guardians}
            shipTags={shipTags}
            focusTags={state.focusTags}
            onToggleFocusTag={toggleFocusTag}
          />

          <GuardianCollectionGrid
            guardians={guardians}
            ownedIds={state.ownedIds}
            onToggleOwned={toggleOwned}
            partyAttrs={partyAttrs}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </div>
  )
}
