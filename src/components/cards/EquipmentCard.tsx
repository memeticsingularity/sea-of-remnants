import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { StatBlock } from '@/components/ui/StatBlock'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { Equipment } from '@/types'

interface EquipmentCardProps {
  equipment: Equipment
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const maxLevel = equipment.slot === '奇珍' ? 0 : 10
  const availableLevels = Object.keys(equipment.statsByLevel || {})
    .map(Number)
    .sort((a, b) => a - b)
  const defaultLevel =
    maxLevel > 0
      ? availableLevels.includes(10)
        ? 10
        : availableLevels[availableLevels.length - 1] || equipment.enhance || 0
      : 0
  const [level, setLevel] = useState(defaultLevel)

  const displayStats =
    maxLevel > 0 && level > 0
      ? equipment.statsByLevel?.[level] || equipment.baseStats
      : equipment.baseStats

  return (
    <Card hover className="h-full">
      <Link to={`/equipment/${equipment.slug}`}>
        <div className="mb-3 flex items-start gap-3">
          {equipment.image ? (
            <img
              src={equipment.image}
              alt={equipment.name}
              className="h-16 w-16 rounded-md bg-surface-light object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-surface-light text-text-dim">
              无图
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text hover:text-accent">{equipment.name}</h3>
              {equipment.enhance !== undefined && (
                <span className="text-sm text-gold">+{equipment.enhance}</span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              <Tag variant="gold">{equipment.rarity}</Tag>
              <Tag>{equipment.slot}</Tag>
              {equipment.handType && <Tag variant="cyan">{equipment.handType}</Tag>}
            </div>
          </div>
        </div>
      </Link>

      {maxLevel > 0 && availableLevels.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-text-muted">强化：</span>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: maxLevel }, (_, i) => i + 1).map((lv) => {
              const hasData = equipment.statsByLevel?.[lv] !== undefined
              return (
                <button
                  key={lv}
                  type="button"
                  disabled={!hasData}
                  onClick={() => setLevel(lv)}
                  className={`h-6 min-w-[1.5rem] rounded px-1.5 text-xs font-medium transition-colors ${
                    level === lv
                      ? 'bg-accent text-white'
                      : hasData
                        ? 'bg-surface-light text-text hover:bg-surface-lighter'
                        : 'cursor-not-allowed bg-surface-light text-text-dim'
                  }`}
                >
                  +{lv}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <StatBlock stats={displayStats} />

      {equipment.fixedAffixes && equipment.fixedAffixes.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <div className="mb-1 text-xs text-text-muted">固定词条</div>
          <ul className="space-y-1">
            {equipment.fixedAffixes.map((affix, index) => (
              <li key={index} className="flex gap-2 text-sm text-text">
                <span className="text-accent">◆</span>
                <GlossaryTooltip text={affix} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
