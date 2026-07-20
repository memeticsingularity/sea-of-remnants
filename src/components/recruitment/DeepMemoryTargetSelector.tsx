import { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { wikiData } from '@/data'
import type { RecruitmentPool } from '@/types'

interface DeepMemoryTargetSelectorProps {
  pool: RecruitmentPool
  crewTargetId: string
  shadowTargetId: string
  onChangeCrewTarget: (id: string) => void
  onChangeShadowTarget: (id: string) => void
}

function useTargetOptions(pool: RecruitmentPool) {
  return useMemo(() => {
    const crewIds = pool.upItems.flatMap((u) => u.crewIds || [])
    const shadowIds = pool.upItems.flatMap((u) => u.shadowIds || [])

    const getName = (id: string) => {
      if (id.startsWith('crew-')) {
        return wikiData.crews.find((c) => c.id === id)?.name ?? id
      }
      if (id.startsWith('shadow-')) {
        return wikiData.shadows.find((s) => s.id === id)?.name ?? id
      }
      return id
    }

    return {
      crews: crewIds.map((id) => ({ id, name: getName(id) })),
      shadows: shadowIds.map((id) => ({ id, name: getName(id) })),
    }
  }, [pool])
}

export function DeepMemoryTargetSelector({
  pool,
  crewTargetId,
  shadowTargetId,
  onChangeCrewTarget,
  onChangeShadowTarget,
}: DeepMemoryTargetSelectorProps) {
  const { crews, shadows } = useTargetOptions(pool)

  return (
    <Card>
      <h3 className="mb-3 text-sm font-medium text-text-muted">选择目标记忆</h3>
      <div className="space-y-4">
        <TargetGroup
          label="目标黑券船员"
          options={crews}
          activeId={crewTargetId}
          onSelect={onChangeCrewTarget}
        />
        <TargetGroup
          label="目标黑券往日之影"
          options={shadows}
          activeId={shadowTargetId}
          onSelect={onChangeShadowTarget}
        />
      </div>
    </Card>
  )
}

function TargetGroup({
  label,
  options,
  activeId,
  onSelect,
}: {
  label: string
  options: { id: string; name: string }[]
  activeId: string
  onSelect: (id: string) => void
}) {
  if (options.length === 0) return null

  return (
    <div>
      <div className="mb-2 text-xs text-text-muted">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.id === activeId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'border-accent bg-surface-light text-accent'
                  : 'border-border text-text-muted hover:border-accent/50 hover:text-text'
              }`}
            >
              {option.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
