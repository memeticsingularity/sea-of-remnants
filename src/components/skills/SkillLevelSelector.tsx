import { getAvailableLevels, getMaxSkillLevel } from '@/data'

interface SkillLevelSelectorProps {
  item: { level?: number; maxLevel?: number; levelDetails?: { level: number; detailedDesc: string }[] }
  selectedLevel: number
  onSelectLevel: (level: number) => void
  size?: 'sm' | 'md'
}

export function SkillLevelSelector({
  item,
  selectedLevel,
  onSelectLevel,
  size = 'md',
}: SkillLevelSelectorProps) {
  const maxLevel = getMaxSkillLevel(item)
  const available = new Set(getAvailableLevels(item))

  if (maxLevel <= 1) return null

  const sizeClasses =
    size === 'sm'
      ? 'h-5 min-w-[1.25rem] px-1 text-[10px]'
      : 'h-6 min-w-[1.5rem] px-1.5 text-xs'

  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-xs text-text-muted">等级：</span>
      {Array.from({ length: maxLevel }, (_, i) => i + 1).map((lv) => {
        const hasData = available.has(lv)
        return (
          <button
            key={lv}
            type="button"
            disabled={!hasData}
            title={hasData ? `Lv.${lv}` : '该等级数据待补充'}
            onClick={() => hasData && onSelectLevel(lv)}
            className={`rounded font-medium transition-colors ${sizeClasses} ${
              selectedLevel === lv
                ? 'bg-accent text-white'
                : hasData
                  ? 'bg-surface-light text-text hover:bg-surface-lighter'
                  : 'cursor-not-allowed bg-surface text-text-dim'
            }`}
          >
            {lv}
          </button>
        )
      })}
    </div>
  )
}
