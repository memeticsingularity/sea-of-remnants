import { Card } from '@/components/ui/Card'

type Depth = 'shallow' | 'middle' | 'deep'

interface MemoryDepthSelectorProps {
  activeDepth: Depth
  onSelect: (depth: Depth) => void
}

const depthOptions: { key: Depth; label: string; subtitle: string }[] = [
  { key: 'shallow', label: '浅层记忆', subtitle: '仅紫券' },
  { key: 'middle', label: '中层记忆', subtitle: '黑券 + 紫券' },
  { key: 'deep', label: '深层记忆', subtitle: '黑券 + 紫券 + 目标 UP' },
]

export function MemoryDepthSelector({ activeDepth, onSelect }: MemoryDepthSelectorProps) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-medium text-text-muted">选择记忆深度</h3>
      <div className="grid grid-cols-3 gap-3">
        {depthOptions.map((option) => {
          const isActive = option.key === activeDepth
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'border-accent bg-surface-light text-text'
                  : 'border-border bg-surface text-text-muted hover:border-accent/50 hover:text-text'
              }`}
            >
              <div className="font-bold">{option.label}</div>
              <div className="mt-1 text-xs opacity-80">{option.subtitle}</div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
