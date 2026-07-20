import { useState } from 'react'
import { Users, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { usePartyConfig, MAIN_ATTRIBUTES } from '@/hooks/usePartyConfig'

export function PartyConfigFloat() {
  const [open, setOpen] = useState(false)
  const { config, setMainAttr, clearSlot, resetConfig } = usePartyConfig()

  const filledCount = config.slots.filter((s) => s.mainAttr !== '').length

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="w-80 p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-text">当前队伍</h3>
              <p className="text-xs text-text-muted">用于判断守护/行装/技能加成是否触发</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-text-muted hover:bg-surface-light hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {config.slots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-12 text-xs text-text-muted">船员 {index + 1}</span>
                <select
                  value={slot.mainAttr}
                  onChange={(e) =>
                    setMainAttr(
                      index,
                      e.target.value === '' ? '' : (e.target.value as typeof MAIN_ATTRIBUTES[number]),
                    )
                  }
                  className="flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text focus:border-accent focus:outline-none"
                >
                  <option value="">未设置</option>
                  {MAIN_ATTRIBUTES.map((attr) => (
                    <option key={attr} value={attr}>
                      {attr}系
                    </option>
                  ))}
                </select>
                {slot.mainAttr && (
                  <button
                    type="button"
                    onClick={() => clearSlot(index)}
                    className="text-xs text-text-muted hover:text-negative"
                  >
                    清除
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={resetConfig}
            className="mt-3 w-full rounded-md border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-negative hover:text-negative"
          >
            清空队伍配置
          </button>
        </Card>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors ${
          filledCount > 0
            ? 'bg-accent hover:bg-accent/90'
            : 'bg-text-muted hover:bg-text'
        }`}
      >
        <Users className="h-4 w-4" />
        队伍
        {filledCount > 0 && (
          <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
            {filledCount}/4
          </span>
        )}
      </button>
    </div>
  )
}
