import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { Guardian } from '@/types'

interface GuardianPickerProps {
  guardians: Guardian[]
  value: (Guardian | undefined)[]
  onChange: (value: (Guardian | undefined)[]) => void
}

export function GuardianPicker({ guardians, value, onChange }: GuardianPickerProps) {
  const [search, setSearch] = useState('')

  const options = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return guardians
    return guardians.filter((g) => g.name.toLowerCase().includes(query))
  }, [guardians, search])

  const handleSelect = (index: number, guardian: Guardian | undefined) => {
    const next = [...value]
    next[index] = guardian
    onChange(next)
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-bold text-text">当前三个选项</h2>

      <div className="grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((index) => {
          const selected = value[index]
          return (
            <div
              key={index}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-text-dim">选项 {index + 1}</span>
                {selected && (
                  <button
                    type="button"
                    onClick={() => handleSelect(index, undefined)}
                    className="text-xs text-text-muted hover:text-negative"
                  >
                    清除
                  </button>
                )}
              </div>

              {selected ? (
                <div className="space-y-2">
                  <p className="font-medium text-text">{selected.name}</p>
                  {selected.set && (
                    <p className="text-xs text-text-dim">{selected.set}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {selected.tags.map((tag, i) => (
                      <Tag key={i} variant="default">
                        {tag.name} ×{tag.count}
                      </Tag>
                    ))}
                  </div>
                  <div className="text-xs text-text-muted">
                    <GlossaryTooltip text={selected.effect} />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索守护…"
                    className="w-full rounded-md border border-border bg-surface-light px-2 py-1.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
                  />
                  <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-surface-light">
                    {options.length > 0 ? (
                      options.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            handleSelect(index, g)
                            setSearch('')
                          }}
                          className="block w-full px-3 py-1.5 text-left text-sm text-text transition-colors hover:bg-surface"
                        >
                          {g.name}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-1.5 text-sm text-text-muted">无匹配守护</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
