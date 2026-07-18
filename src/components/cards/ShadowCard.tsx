import { Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import type { Shadow } from '@/types'

interface ShadowCardProps {
  shadow: Shadow
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

const shadowRarityMap: Record<'黑' | '紫' | '蓝', 'black' | 'purple' | 'blue'> = {
  黑: 'black',
  紫: 'purple',
  蓝: 'blue',
}

export function ShadowCard({ shadow, pulledCount = 0, rarity }: ShadowCardProps) {
  const isLocked = pulledCount === 0
  const displayRarity = rarity ?? shadowRarityMap[shadow.rarity] ?? 'blue'
  const variant = rarityVariants[displayRarity]

  return (
    <Card hover={!isLocked} className="relative h-full">
      <div className={`flex items-start gap-3 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
        {shadow.image ? (
          <img
            src={shadow.image}
            alt={shadow.name}
            className="h-16 w-16 rounded-md bg-surface-light object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-surface-light text-text-dim">
            无图
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text">{shadow.name}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            <Tag variant={variant}>{rarityLabels[displayRarity]}</Tag>
            {shadow.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </div>

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
  )
}
