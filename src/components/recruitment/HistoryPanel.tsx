import { Card } from '@/components/ui/Card'
import type { GachaResult } from '@/hooks/useGachaState'

interface HistoryPanelProps {
  history: GachaResult[]
  onClear: () => void
}

const rarityLabels: Record<GachaResult['rarity'], string> = {
  black: '黑券',
  purple: '紫券',
  blue: '蓝券',
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <Card>
        <p className="text-sm text-text-muted">暂无抽取记录。</p>
      </Card>
    )
  }

  return (
    <Card className="max-h-80 overflow-y-auto">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-text">抽取历史</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-text-muted hover:text-negative"
        >
          清空
        </button>
      </div>
      <ul className="space-y-2">
        {history.slice(0, 100).map((item, index) => (
          <li
            key={`${item.timestamp}-${index}`}
            className="flex items-center justify-between rounded-md bg-surface-light px-3 py-2 text-sm"
          >
            <span className="text-text">
              [{item.poolName}] {item.name}
              {item.isUp && (
                <span className="ml-1 text-accent">UP</span>
              )}
            </span>
            <span className="text-xs text-text-muted">
              {rarityLabels[item.rarity]} · {item.type === 'crew' ? '船员' : '往日之影'}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
