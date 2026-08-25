import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { GachaResult } from '@/hooks/useGachaState'
import { wikiData } from '@/data'

interface HistoryPanelProps {
  history: GachaResult[]
  onClear: () => void
}

const rarityLabels: Record<GachaResult['rarity'], string> = {
  black: '黑券',
  purple: '紫券',
  blue: '蓝券',
}

const rarityText: Record<GachaResult['rarity'], string> = {
  black: 'text-gold',
  purple: 'text-purple',
  blue: 'text-accent-cyan',
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  const pools = wikiData.recruitmentPools
  const [filterPoolId, setFilterPoolId] = useState<string>('all')

  const filteredHistory = useMemo(() => {
    if (filterPoolId === 'all') return history
    return history.filter((item) => item.poolId === filterPoolId)
  }, [history, filterPoolId])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <Card className="max-h-[60vh] overflow-y-auto">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-text">抽取历史</h3>
          <select
            value={filterPoolId}
            onChange={(e) => setFilterPoolId(e.target.value)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text"
          >
            <option value="all">全部招募类型</option>
            {pools.map((pool) => (
              <option key={pool.id} value={pool.id}>{pool.name}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-text-muted hover:text-negative"
        >
          清空
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <p className="text-sm text-text-muted">暂无抽取记录。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="py-2 text-left font-medium">对象类型</th>
                <th className="py-2 text-left font-medium">对象名称</th>
                <th className="py-2 text-left font-medium">招募类型</th>
                <th className="py-2 text-left font-medium">招募时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory.slice(0, 100).map((item, index) => (
                <tr key={`${item.timestamp}-${index}`} className="text-text">
                  <td className="py-2">
                    <span className={rarityText[item.rarity]}>
                      {item.type === 'crew' ? '船员' : '往日之影'} · {rarityLabels[item.rarity]}
                    </span>
                  </td>
                  <td className="py-2">
                    {item.name}
                    {item.isUp && (
                      <span className="ml-1 text-accent">UP</span>
                    )}
                  </td>
                  <td className="py-2 text-text-muted">{item.poolName}</td>
                  <td className="py-2 text-text-muted">{formatTime(item.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
