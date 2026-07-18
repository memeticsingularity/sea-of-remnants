import { Card } from '@/components/ui/Card'
import type { GachaStats } from '@/hooks/useGachaStats'

interface StatsPanelProps {
  stats: GachaStats
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <Card>
      <h3 className="mb-3 font-bold text-text">出货统计</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="总抽数" value={String(stats.totalPulls)} />
        <Stat label="黑券" value={`${stats.blackCount} (${formatPercent(stats.blackRate)})`} />
        <Stat label="紫券" value={`${stats.purpleCount} (${formatPercent(stats.purpleRate)})`} />
        <Stat label="蓝券" value={`${stats.blueCount} (${formatPercent(stats.blueRate)})`} />
        <Stat label="UP 数" value={`${stats.upCount} (${formatPercent(stats.upRate)})`} />
        <Stat
          label="平均黑券抽数"
          value={stats.averageBlackPity > 0 ? stats.averageBlackPity.toFixed(1) : '-'}
        />
        <Stat
          label="平均紫券抽数"
          value={stats.averagePurplePity > 0 ? stats.averagePurplePity.toFixed(1) : '-'}
        />
      </div>
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
