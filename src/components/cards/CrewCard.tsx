import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { StatBlock } from '@/components/ui/StatBlock'
import type { Crew } from '@/types'

interface CrewCardProps {
  crew: Crew
  pulledCount?: number
  rarity?: 'black' | 'purple' | 'blue'
}

const rarityLabels: Record<'black' | 'purple' | 'blue', string> = {
  black: '黑券',
  purple: '紫券',
  blue: '蓝券',
}

const rarityVariants: Record<'black' | 'purple' | 'blue', 'gold' | 'accent' | 'cyan'> = {
  black: 'gold',
  purple: 'accent',
  blue: 'cyan',
}

export function CrewCard({ crew, pulledCount = 0, rarity }: CrewCardProps) {
  const isLocked = pulledCount === 0

  return (
    <Link to={`/crews/${crew.slug}`}>
      <Card hover={!isLocked} className="relative h-full">
        <div className={`mb-3 flex items-start gap-3 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
          {crew.image ? (
            <img
              src={crew.image}
              alt={crew.name}
              className="h-16 w-16 rounded-md bg-surface-light object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-surface-light text-text-dim">
              无图
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text">{crew.name}</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {rarity ? (
                <Tag variant={rarityVariants[rarity]}>{rarityLabels[rarity]}</Tag>
              ) : (
                <Tag variant="gold">{crew.rarity}</Tag>
              )}
              {crew.role && <Tag>{crew.role}</Tag>}
              {crew.element && <Tag variant="cyan">{crew.element}</Tag>}
            </div>
          </div>
        </div>
        <StatBlock stats={crew.baseStats} />

        {isLocked ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-surface/60">
            <Lock className="h-6 w-6 text-text-muted" />
          </div>
        ) : (
          <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white shadow-md">
            {pulledCount}
          </div>
        )}
      </Card>
    </Link>
  )
}
