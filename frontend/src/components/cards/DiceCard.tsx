import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { Dice } from '@/types'

interface DiceCardProps {
  dice: Dice
}

export function DiceCard({ dice }: DiceCardProps) {
  return (
    <Card hover className="h-full">
      <Link to={`/dice/${dice.slug}`}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text hover:text-accent">{dice.name}</h3>
          {dice.level !== undefined && (
            <span className="text-sm text-text-muted">Lv.{dice.level}</span>
          )}
        </div>
      </Link>
      <div className="mb-3 flex flex-wrap gap-1">
        <Tag variant="accent">{dice.type}</Tag>
        {dice.maxLevel !== undefined && (
          <Tag variant="cyan">上限 Lv.{dice.maxLevel}</Tag>
        )}
      </div>
      <p className="text-sm text-text-muted">
        <GlossaryTooltip text={dice.shortDesc} />
      </p>
    </Card>
  )
}
