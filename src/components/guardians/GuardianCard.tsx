import { Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { Guardian } from '@/types'

interface GuardianCardProps {
  guardian: Guardian
  owned: boolean
  onToggleOwned: (id: string) => void
}

const rarityClasses: Record<Guardian['rarity'], string> = {
  金: 'border-gold bg-gold/15 shadow-[0_0_20px_rgba(245,158,11,0.18)]',
  紫: 'border-purple bg-purple/10 shadow-[0_0_16px_rgba(139,92,246,0.12)]',
  蓝: 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_16px_rgba(6,182,212,0.12)]',
}

const rarityBadgeClasses: Record<Guardian['rarity'], string> = {
  金: 'bg-gold/20 text-gold border-gold/50 shadow-[0_0_8px_rgba(245,158,11,0.25)]',
  紫: 'bg-purple/20 text-purple border-purple/50 shadow-[0_0_8px_rgba(139,92,246,0.2)]',
  蓝: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50 shadow-[0_0_8px_rgba(6,182,212,0.2)]',
}

export function GuardianCard({ guardian, owned, onToggleOwned }: GuardianCardProps) {
  return (
    <Card
      className={`relative flex h-full flex-col gap-2 transition-all ${
        owned ? 'border-accent/40 bg-accent/5' : rarityClasses[guardian.rarity]
      }`}
    >
      <button
        type="button"
        onClick={() => onToggleOwned(guardian.id)}
        className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
          owned
            ? 'border-accent bg-accent text-white'
            : 'border-border text-text-dim hover:border-accent hover:text-accent'
        }`}
        title={owned ? '已拥有，点击取消' : '标记为已拥有'}
      >
        {owned && <Check className="h-4 w-4" />}
      </button>

      <div className="flex items-start justify-between pr-8">
        <div>
          <h3 className="font-bold text-text">{guardian.name}</h3>
          {guardian.set && (
            <p className="text-xs text-text-dim">{guardian.set}</p>
          )}
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${rarityBadgeClasses[guardian.rarity]}`}
        >
          {guardian.rarity}
        </span>
      </div>

      {guardian.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {guardian.tags.map((tag, index) => (
            <Tag key={index} variant={owned ? 'accent' : 'default'}>
              {tag.name} ×{tag.count}
            </Tag>
          ))}
        </div>
      )}

      <div className="mt-auto text-sm leading-relaxed text-text-muted">
        <GlossaryTooltip text={guardian.effect} />
      </div>
    </Card>
  )
}
