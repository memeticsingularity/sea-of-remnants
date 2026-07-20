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
  ownedIds: string[]
  loadouts: Record<GuardianCategory, (string | null)[]>
  onEquip: (category: GuardianCategory, slotIndex: number, id: string | null) => void
  onUnequip: (category: GuardianCategory, slotIndex: number) => void
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

export function LoadoutPanel({
  guardians,
  ownedIds,
  loadouts,
  onEquip,
  onUnequip,
}: LoadoutPanelProps) {
  const ownedGuardians = guardians.filter((g) => ownedIds.includes(g.id))

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
    return ownedGuardians.filter(
      (g) =>
        g.category === category &&
        g.set === requiredSet &&
        (!equippedIds.has(g.id) ||
          getEquippedId(category, index) === g.id),
    )
  }

  return (
    <div className="space-y-6">
      {GUARDIAN_CATEGORIES.map((category) => (
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

                  <select
                    value={equipped?.id ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        onUnequip(category, index)
                      } else {
                        onEquip(category, index, value)
                      }
                    }}
                    className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text focus:border-accent focus:outline-none"
                  >
                    <option value="">{equipped ? '卸下' : '选择守护...'}</option>
                    {candidates.map((g) => (
                      <option key={g.id} value={g.id}>
                        [{g.rarity}] {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
