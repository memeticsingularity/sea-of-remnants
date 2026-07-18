import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'

type CollectionRarity = 'black' | 'purple' | 'blue'

interface CollectionItemCardProps {
  id: string
  name: string
  slug: string
  image?: string
  rarity: CollectionRarity
  type: 'crew' | 'shadow'
  pulledCount: number
}

const rarityLabels: Record<CollectionRarity, string> = {
  black: '黑券',
  purple: '紫券',
  blue: '蓝券',
}

const rarityVariants: Record<CollectionRarity, 'gold' | 'accent' | 'cyan'> = {
  black: 'gold',
  purple: 'accent',
  blue: 'cyan',
}

export function CollectionItemCard({
  name,
  slug,
  image,
  rarity,
  type,
  pulledCount,
}: CollectionItemCardProps) {
  const isLocked = pulledCount === 0
  const content = (
    <Card hover={!isLocked} className="relative h-full p-3">
      <div className={`flex flex-col items-center gap-2 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-16 w-16 rounded-md bg-surface-light object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-surface-light text-xs text-text-dim">
            无图
          </div>
        )}
        <div className="w-full text-center">
          <p className="truncate text-sm font-bold text-text">{name}</p>
          <div className="mt-1 flex justify-center">
            <Tag variant={rarityVariants[rarity]}>{rarityLabels[rarity]}</Tag>
          </div>
        </div>
      </div>

      {isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-surface/60">
          <Lock className="h-5 w-5 text-text-muted" />
        </div>
      ) : (
        <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white shadow-md">
          {pulledCount}
        </div>
      )}
    </Card>
  )

  if (type === 'crew') {
    return <Link to={`/crews/${slug}`}>{content}</Link>
  }

  return content
}
