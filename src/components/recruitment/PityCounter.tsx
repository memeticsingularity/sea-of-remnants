import { Card } from '@/components/ui/Card'
import type { GachaState } from '@/hooks/useGachaState'
import type { RecruitmentPool } from '@/types'

interface PityCounterProps {
  state: GachaState
  pool?: RecruitmentPool
}

export function PityCounter({ state, pool }: PityCounterProps) {
  const isMemory = pool?.slug.endsWith('-memory') ?? false

  if (isMemory) {
    return (
      <Card className="flex flex-wrap gap-6">
        <Counter label="黑券保底" current={state.blackPity} max={3} color="gold" />
        <Counter label="黑券船员保底" current={state.blackCrewPity} max={9} color="gold" />
        <div className="flex items-center gap-4">
          {state.blackUpGuarantee && (
            <span className="rounded-full border border-gold bg-gold/10 px-3 py-1 text-xs text-gold">
              下次黑券目标概率提升
            </span>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-wrap gap-6">
      <Counter label="黑券保底" current={state.blackPity} max={80} color="gold" />
      <Counter label="紫券保底" current={state.purplePity} max={10} color="purple" />
      <div className="flex items-center gap-4">
        {state.blackUpGuarantee && (
          <span className="rounded-full border border-gold bg-gold/10 px-3 py-1 text-xs text-gold">
            下次黑券必出 UP
          </span>
        )}
        {state.purpleUpGuarantee && (
          <span className="rounded-full border border-purple bg-purple/10 px-3 py-1 text-xs text-purple">
            下次紫券必出 UP
          </span>
        )}
      </div>
    </Card>
  )
}

interface CounterProps {
  label: string
  current: number
  max: number
  color: 'gold' | 'purple'
}

function Counter({ label, current, max, color }: CounterProps) {
  const colorClasses = {
    gold: 'text-gold',
    purple: 'text-purple',
  }
  const progress = Math.min(current / max, 1)
  return (
    <div className="min-w-[140px]">
      <div className="mb-1 flex justify-between text-sm text-text-muted">
        <span>{label}</span>
        <span className={colorClasses[color]}>
          {current}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-light">
        <div
          className={`h-full rounded-full transition-all ${
            color === 'gold' ? 'bg-gold' : 'bg-purple'
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
