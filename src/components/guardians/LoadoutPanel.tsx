import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import {
  GUARDIAN_CATEGORIES,
  getSlotSet,
  type GuardianCategory,
} from '@/hooks/useGuardianState'
import type { Guardian } from '@/types'

interface LoadoutPanelProps {
  guardians: Guardian[]
  loadouts: Record<GuardianCategory, (string | null)[]>
  onEquip: (category: GuardianCategory, slotIndex: number, id: string | null) => void
  onUnequip: (category: GuardianCategory, slotIndex: number) => void
  activeCategory?: GuardianCategory
  /** 右侧图鉴筛选后的 ID 集合，用于限制左侧候选池 */
  galleryFilteredIds?: Set<string>
}

const categoryLabels: Record<GuardianCategory, string> = {
  战技特化: '战技特化',
  潜能特化: '潜能特化',
  船员培养: '船员培养',
}

const rarityColors: Record<Guardian['rarity'], string> = {
  金: 'text-gold',
  紫: 'text-purple',
  蓝: 'text-accent-cyan',
}

function SearchableSelect({
  options,
  selected,
  onSelect,
  placeholder,
}: {
  options: Guardian[]
  selected?: Guardian
  onSelect: (id: string | null) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const filtered = options.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-left text-sm text-text transition-colors hover:border-accent focus:border-accent focus:outline-none"
      >
        {selected ? (
          <span className={rarityColors[selected.rarity]}>{selected.name}</span>
        ) : (
          <span className="text-text-dim">{placeholder}</span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-md border border-border bg-surface shadow-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入守护名称…"
            className="sticky top-0 w-full border-b border-border bg-surface px-2 py-1.5 text-sm text-text placeholder:text-text-dim focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          {selected && (
            <button
              type="button"
              onClick={() => {
                onSelect(null)
                setOpen(false)
                setQuery('')
              }}
              className="block w-full px-2 py-1.5 text-left text-xs text-negative hover:bg-surface-light"
            >
              卸下
            </button>
          )}
          {filtered.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-text-dim">无匹配守护</p>
          ) : (
            filtered.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  onSelect(g.id)
                  setOpen(false)
                  setQuery('')
                }}
                className="block w-full px-2 py-1.5 text-left text-sm hover:bg-surface-light"
              >
                <span className={`${rarityColors[g.rarity]} mr-1`}>[{g.rarity}]</span>
                <span className="text-text">{g.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function LoadoutPanel({
  guardians,
  loadouts,
  onEquip,
  onUnequip,
  activeCategory,
  galleryFilteredIds,
}: LoadoutPanelProps) {
  const categories = activeCategory ? [activeCategory] : GUARDIAN_CATEGORIES

  function getEquippedId(category: GuardianCategory, index: number) {
    return loadouts[category][index]
  }

  function getEquippedGuardian(category: GuardianCategory, index: number) {
    const id = getEquippedId(category, index)
    return id ? guardians.find((g) => g.id === id) : undefined
  }

  function getCandidates(category: GuardianCategory, index: number) {
    const requiredSet = getSlotSet(index)
    const equippedIds = new Set(
      GUARDIAN_CATEGORIES.flatMap((cat) =>
        loadouts[cat].filter((id): id is string => id !== null),
      ),
    )
    return guardians.filter(
      (g) =>
        g.category === category &&
        g.set === requiredSet &&
        (!equippedIds.has(g.id) ||
          getEquippedId(category, index) === g.id) &&
        (!galleryFilteredIds || galleryFilteredIds.has(g.id)),
    )
  }

  return (
    <div className={activeCategory ? '' : 'space-y-6'}>
      {categories.map((category) => (
        <Card key={category} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">{categoryLabels[category]}</h2>
            <Tag variant="default">
              {
                loadouts[category].filter((id): id is string => id !== null)
                  .length
              }{' '}
              / 7
            </Tag>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 7 }, (_, index) => {
              const equipped = getEquippedGuardian(category, index)
              const requiredSet = getSlotSet(index)
              const candidates = getCandidates(category, index)

              return (
                <div
                  key={index}
                  className={`relative rounded-lg border p-3 ${
                    equipped
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-border bg-surface-light'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-text-muted">槽位 {index + 1}</span>
                    <Tag variant="default" className="text-xs">
                      {requiredSet}
                    </Tag>
                  </div>

                  {equipped ? (
                    <div className="mb-2">
                      <div
                        className={`font-bold ${rarityColors[equipped.rarity]}`}
                      >
                        {equipped.name}
                      </div>
                      {equipped.set && (
                        <p className="text-xs text-text-dim">{equipped.set}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mb-2 text-sm text-text-dim">空槽</p>
                  )}

                  <SearchableSelect
                    options={candidates}
                    selected={equipped}
                    onSelect={(id) => {
                      if (id === null) {
                        onUnequip(category, index)
                      } else {
                        onEquip(category, index, id)
                      }
                    }}
                    placeholder="选择守护..."
                  />
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
