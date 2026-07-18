import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { StatBlock } from '@/components/ui/StatBlock'
import type { Equipment } from '@/types'

interface EquipmentCardProps {
  equipment: Equipment
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Link to={`/equipment/${equipment.slug}`}>
      <Card hover className="h-full">
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
              <h3 className="text-lg font-bold text-text">{equipment.name}</h3>
              {equipment.enhance !== undefined && (
                <span className="text-sm text-gold">+{equipment.enhance}</span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              <Tag variant="gold">{equipment.rarity}</Tag>
              <Tag>{equipment.slot}</Tag>
            </div>
          </div>
        </div>
        <StatBlock stats={equipment.baseStats} />
      </Card>
    </Link>
  )
}
