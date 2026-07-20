import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Trash2 } from 'lucide-react'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GuardianCollectionGrid } from '@/components/guardians/GuardianCollectionGrid'
import { ShipTagStatsPanel } from '@/components/guardians/ShipTagStatsPanel'
import { LoadoutPanel } from '@/components/guardians/LoadoutPanel'
import { useGuardianState, GUARDIAN_CATEGORIES } from '@/hooks/useGuardianState'
import { usePartyConfig } from '@/hooks/usePartyConfig'

export function FigureheadPrayerPage() {
  const guardians = wikiData.guardians
  const shipTags = wikiData.shipTags
  const crews = wikiData.crews

  const { state, toggleOwned, toggleFocusTag, clearOwned, equipGuardian, unequipGuardian, clearLoadouts } = useGuardianState()
  const { config } = usePartyConfig()

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

      <LoadoutPanel
        guardians={guardians}
        ownedIds={state.ownedIds}
        loadouts={state.loadouts}
        onEquip={equipGuardian}
        onUnequip={unequipGuardian}
      />

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
      />
    </div>
  )
}
