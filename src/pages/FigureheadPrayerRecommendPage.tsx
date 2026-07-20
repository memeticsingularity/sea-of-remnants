import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Tag } from '@/components/ui/Tag'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import { GuardianPicker } from '@/components/guardians/GuardianPicker'
import { ShipTagStatsPanel } from '@/components/guardians/ShipTagStatsPanel'
import { useGuardianState } from '@/hooks/useGuardianState'
import { getTagCounts, getTagSummary } from '@/utils/guardianRecommend'
import type { Guardian, ShipTag } from '@/types'

function TagDelta({ guardian, baseCounts, shipTags }: {
  guardian: Guardian
  baseCounts: Map<string, number>
  shipTags: ShipTag[]
}) {
  if (guardian.tags.length === 0) {
    return <p className="text-xs text-text-dim">不提供标签</p>
  }

  return (
    <div className="space-y-1">
      {guardian.tags.map((tag, i) => {
        const current = baseCounts.get(tag.name) || 0
        const next = current + tag.count
        const meta = shipTags.find((st) => st.name === tag.name)
        const crossed = meta?.levels
          .slice()
          .sort((a, b) => a.count - b.count)
          .filter((l) => current < l.count && next >= l.count)

        return (
          <div key={i} className="text-xs">
            <span className="text-text">{tag.name}</span>{' '}
            <span className="text-text-muted">{current} → {next} (+{tag.count})</span>
            {crossed && crossed.length > 0 && (
              <span className="ml-1 text-positive">
                突破 {crossed.map((l) => l.count).join(',')} 档
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

const rarityClasses: Record<Guardian['rarity'], string> = {
  金: 'border-gold bg-gold/15 shadow-[0_0_20px_rgba(245,158,11,0.18)] text-gold',
  紫: 'border-purple bg-purple/10 shadow-[0_0_16px_rgba(139,92,246,0.12)] text-purple',
  蓝: 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_16px_rgba(6,182,212,0.12)] text-accent-cyan',
}

export function FigureheadPrayerRecommendPage() {
  const guardians = wikiData.guardians
  const shipTags = wikiData.shipTags

  const { state, toggleFocusTag, clearOwned } = useGuardianState()
  const [pickerValue, setPickerValue] = useState<(Guardian | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ])

  const ownedGuardians = useMemo(
    () => guardians.filter((g) => state.ownedIds.includes(g.id)),
    [guardians, state.ownedIds],
  )
  const baseTagCounts = useMemo(() => getTagCounts(ownedGuardians), [ownedGuardians])
  const tagSummary = useMemo(
    () => getTagSummary(state.ownedIds, guardians, shipTags),
    [state.ownedIds, guardians, shipTags],
  )

  const validCandidates = pickerValue.filter((g): g is Guardian => g !== undefined)

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '船员培养', to: '/crews' },
          { label: '船首像祈祷', to: '/crews/figurehead-prayer' },
          { label: '三选一求助' },
        ]}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/crews/figurehead-prayer"
            className="rounded-lg border border-border p-2 text-text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text">三选一求助</h1>
            <p className="text-sm text-text-muted">对比当前选项 · 标签变化 · 截图问我</p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearOwned}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:border-negative hover:text-negative"
        >
          清空已拥有
        </button>
      </div>

      <ShipTagStatsPanel
        ownedIds={state.ownedIds}
        allGuardians={guardians}
        shipTags={shipTags}
        focusTags={state.focusTags}
        onToggleFocusTag={toggleFocusTag}
      />

      <GuardianPicker
        guardians={guardians}
        value={pickerValue}
        onChange={setPickerValue}
      />

      {validCandidates.length > 0 && (
        <Card className="space-y-4">
          <h2 className="text-lg font-bold text-text">选项对比</h2>

          <div className="grid gap-3 md:grid-cols-3">
            {validCandidates.map((g) => {
              const isDuplicate = state.ownedIds.includes(g.id)
              return (
                <div
                  key={g.id}
                  className={`rounded-lg border p-3 ${
                    isDuplicate
                      ? 'border-negative/50 bg-negative/5'
                      : rarityClasses[g.rarity]
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-text">{g.name}</span>
                    <div className="flex items-center gap-1">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${rarityClasses[g.rarity]}`}>
                        {g.rarity}
                      </span>
                      {isDuplicate && (
                        <Tag variant="default" className="text-negative">已拥有</Tag>
                      )}
                    </div>
                  </div>
                  {g.set && (
                    <p className="mb-2 text-xs text-text-dim">{g.set}</p>
                  )}
                  <div className="mb-3 text-sm text-text-muted">
                    <GlossaryTooltip text={g.effect} />
                  </div>
                  <div className="rounded-md bg-surface-light p-2">
                    <p className="mb-1 text-xs font-medium text-text-muted">标签变化</p>
                    <TagDelta
                      guardian={g}
                      baseCounts={baseTagCounts}
                      shipTags={shipTags}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="mb-2 text-sm font-medium text-text-muted">当前标签总览（用于对比）</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {tagSummary
                .filter((s) => s.count > 0)
                .map((s) => (
                  <div key={s.name} className="text-xs">
                    <span className="text-text">{s.name}</span>{' '}
                    <span className="text-text-muted">×{s.count}</span>
                    {s.activeLevel && (
                      <span className="ml-1 text-positive">
                        生效 {s.activeLevel.count}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
