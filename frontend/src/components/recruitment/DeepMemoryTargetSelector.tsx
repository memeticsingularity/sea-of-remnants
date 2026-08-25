import { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { useCollection } from '@/hooks/useCollection'
import type { RecruitmentPool, Crew, Shadow } from '@/types'

interface DeepMemoryTargetSelectorProps {
  pool: RecruitmentPool
  crewTargetId: string
  shadowTargetId: string
  onChangeGroup: (crewId: string, shadowId: string) => void
}

interface TargetGroup {
  crewId: string
  crewName: string
  shadowId: string
  shadowName: string
}

function useTargetGroups(pool: RecruitmentPool): TargetGroup[] {
  const { data: crewData } = useCollection<Crew>('crews')
  const { data: shadowData } = useCollection<Shadow>('shadows')
  return useMemo(() => {
    const crewList = crewData ?? []
    const shadowList = shadowData ?? []
    const crewIds = pool.upItems.flatMap((u) => u.crewIds || [])
    const shadowIds = pool.upItems.flatMap((u) => u.shadowIds || [])

    const getName = (id: string) => {
      if (id.startsWith('crew-')) {
        return crewList.find((c) => c.id === id)?.name ?? id
      }
      if (id.startsWith('shadow-')) {
        return shadowList.find((s) => s.id === id)?.name ?? id
      }
      return id
    }

    const length = Math.min(crewIds.length, shadowIds.length)
    const groups: TargetGroup[] = []
    for (let i = 0; i < length; i++) {
      groups.push({
        crewId: crewIds[i],
        crewName: getName(crewIds[i]),
        shadowId: shadowIds[i],
        shadowName: getName(shadowIds[i]),
      })
    }
    return groups
  }, [pool, crewData, shadowData])
}

export function DeepMemoryTargetSelector({
  pool,
  crewTargetId,
  shadowTargetId,
  onChangeGroup,
}: DeepMemoryTargetSelectorProps) {
  const groups = useTargetGroups(pool)

  if (groups.length === 0) return null

  return (
    <Card>
      <h3 className="mb-3 text-sm font-medium text-text-muted">选择目标记忆</h3>
      <div className="flex flex-wrap gap-3">
        {groups.map((group) => {
          const isActive = group.crewId === crewTargetId && group.shadowId === shadowTargetId
          return (
            <button
              key={`${group.crewId}-${group.shadowId}`}
              type="button"
              onClick={() => onChangeGroup(group.crewId, group.shadowId)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'border-accent bg-surface-light text-text'
                  : 'border-border bg-surface text-text-muted hover:border-accent/50 hover:text-text'
              }`}
            >
              <div className="font-bold">
                {group.crewName} · {group.shadowName}
              </div>
              <div className="mt-1 text-xs opacity-80">目标黑券船员 + 目标黑券往日之影</div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
