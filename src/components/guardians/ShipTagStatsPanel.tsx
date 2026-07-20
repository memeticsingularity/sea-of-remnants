import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import type { Guardian, ShipTag } from '@/types'
import { getTagSummary } from '@/utils/guardianRecommend'

interface ShipTagStatsPanelProps {
  ownedIds: string[]
  allGuardians: Guardian[]
  shipTags: ShipTag[]
  focusTags: string[]
  onToggleFocusTag: (name: string) => void
}

export function ShipTagStatsPanel({
  ownedIds,
  allGuardians,
  shipTags,
  focusTags,
  onToggleFocusTag,
}: ShipTagStatsPanelProps) {
  const summary = getTagSummary(ownedIds, allGuardians, shipTags)
  const hasData = summary.some((s) => s.count > 0)

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">标签统计</h2>
        <p className="text-xs text-text-dim">点击标签可置顶推荐权重</p>
      </div>

      {!hasData ? (
        <p className="text-sm text-text-muted">
          还没有标记任何已拥有的守护。在下方图鉴中勾选已拥有的守护后，这里会实时汇总标签数量。
        </p>
      ) : (
        <div className="grid gap-3">
          {summary
            .filter((s) => s.count > 0 || focusTags.includes(s.name))
            .map((s) => {
              const isFocused = focusTags.includes(s.name)
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => onToggleFocusTag(s.name)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                    isFocused
                      ? 'border-accent bg-accent/5'
                      : 'border-border bg-surface hover:border-accent/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text">{s.name}</span>
                      <Tag variant={isFocused ? 'accent' : 'default'}>×{s.count}</Tag>
                      {isFocused && <span className="text-xs text-accent">已置顶</span>}
                    </div>
                    <div className="text-xs text-text-muted">
                      {s.activeLevel ? (
                        <span>
                          当前档位 {s.activeLevel.count}：{s.activeLevel.effect}
                        </span>
                      ) : (
                        <span>暂无生效档位</span>
                      )}
                      {s.nextLevel && (
                        <span className="ml-2">
                          | 下一档 {s.nextLevel.count}（还差 {s.nextLevel.count - s.count}）
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
        </div>
      )}
    </Card>
  )
}
