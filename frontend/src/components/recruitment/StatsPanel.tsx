import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { RecruitmentPool } from '@/types'
import type { GachaResult } from '@/hooks/useGachaState'
import { useGachaStats } from '@/hooks/useGachaStats'

interface StatsPanelProps {
  history: GachaResult[]
  pools: RecruitmentPool[]
  activePoolId: string
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function StatsPanel({ history, pools, activePoolId }: StatsPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedPoolId, setSelectedPoolId] = useState<string>(activePoolId)
  const stats = useGachaStats(history, selectedPoolId)

  useEffect(() => {
    setSelectedPoolId(activePoolId)
  }, [activePoolId])

  return (
    <Card>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="font-bold text-text">出货统计</h3>
        <span className="text-sm text-text-muted">{expanded ? '收起' : '展开'}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <label htmlFor="stats-pool-select" className="text-sm text-text-muted">
              招募池
            </label>
            <select
              id="stats-pool-select"
              value={selectedPoolId}
              onChange={(e) => setSelectedPoolId(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="总抽数" value={String(stats.totalPulls)} />
            <Stat label="黑券" value={`${stats.blackCount} (${formatPercent(stats.blackRate)})`} />
            <Stat label="紫券" value={`${stats.purpleCount} (${formatPercent(stats.purpleRate)})`} />
            <Stat label="蓝券" value={`${stats.blueCount} (${formatPercent(stats.blueRate)})`} />
            <Stat label="UP 数" value={`${stats.upCount} (${formatPercent(stats.upRate)})`} />
            <Stat
              label="UP 黑券"
              value={`${stats.upBlackCount} (${formatPercent(stats.upBlackRate)})`}
            />
            <Stat
              label="UP 紫券"
              value={`${stats.upPurpleCount} (${formatPercent(stats.upPurpleRate)})`}
            />
            <Stat
              label="平均黑券抽数"
              value={stats.averageBlackPity > 0 ? stats.averageBlackPity.toFixed(1) : '-'}
            />
            <Stat
              label="平均紫券抽数"
              value={stats.averagePurplePity > 0 ? stats.averagePurplePity.toFixed(1) : '-'}
            />
          </div>
        </div>
      )}
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface-light p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-text">{value}</p>
    </div>
  )
}
