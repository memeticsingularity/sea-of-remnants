import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { RandomAffix } from '@/types'

interface RandomAffixCardProps {
  affix: RandomAffix
}

export function RandomAffixCard({ affix }: RandomAffixCardProps) {
  const count = affix.occurrences?.length || 0
  return (
    <Link to={`/random-affixes/${affix.slug}`}>
      <Card hover className="h-full">
        <h3 className="mb-2 text-lg font-bold text-text hover:text-accent">{affix.name}</h3>
        <p className="mb-3 text-sm text-text-muted">
          <GlossaryTooltip text={affix.effect} />
        </p>
        <div className="text-xs text-text-muted">
          出现于 {count} 件行装
        </div>
      </Card>
    </Link>
  )
}
