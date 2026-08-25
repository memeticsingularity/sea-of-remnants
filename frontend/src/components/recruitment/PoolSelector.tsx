import { Card } from '@/components/ui/Card'
import type { RecruitmentPool } from '@/types'

interface PoolSelectorProps {
  pools: RecruitmentPool[]
  activePoolId: string
  onSelect: (poolId: string) => void
}

const typeLabels: Record<string, string> = {
  limited: '活动限时',
  standard: '常驻',
  weekly: '每周免费',
}

const typeClasses: Record<string, string> = {
  limited: 'border-accent text-accent',
  standard: 'border-accent-cyan text-accent-cyan',
  weekly: 'border-gold text-gold',
}

export function PoolSelector({ pools, activePoolId, onSelect }: PoolSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {pools.map((pool) => {
        const isActive = pool.id === activePoolId
        return (
          <button
            key={pool.id}
            type="button"
            onClick={() => onSelect(pool.id)}
            className={`text-left transition-colors ${
              isActive ? 'ring-1 ring-accent' : ''
            }`}
          >
            <Card className={`h-full ${isActive ? 'bg-surface-light' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-text">{pool.name}</h3>
                  <p className="mt-1 text-xs text-text-muted">{pool.currency}</p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    typeClasses[pool.type] ?? 'border-border text-text-muted'
                  }`}
                >
                  {typeLabels[pool.type] ?? pool.type}
                </span>
              </div>
            </Card>
          </button>
        )
      })}
    </div>
  )
}
