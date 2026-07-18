import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { StatBlock } from '@/components/ui/StatBlock'
import type { Crew } from '@/types'

interface CrewCardProps {
  crew: Crew
}

export function CrewCard({ crew }: CrewCardProps) {
  return (
    <Link to={`/crews/${crew.slug}`}>
      <Card hover className="h-full">
        <div className="mb-3 flex items-start gap-3">
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
              <Tag variant="gold">{crew.rarity}</Tag>
              {crew.role && <Tag>{crew.role}</Tag>}
              {crew.element && <Tag variant="cyan">{crew.element}</Tag>}
            </div>
          </div>
        </div>
        <StatBlock stats={crew.baseStats} />
      </Card>
    </Link>
  )
}
