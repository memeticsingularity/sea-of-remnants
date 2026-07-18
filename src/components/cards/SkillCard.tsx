import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { Skill, Dice } from '@/types'

interface SkillCardProps {
  skill: Skill | Dice
}

export function SkillCard({ skill }: SkillCardProps) {
  const isSkill = 'tags' in skill
  const tags = isSkill ? skill.tags : []
  const to = isSkill ? `/skills/${skill.slug}` : `/dice/${skill.slug}`

  return (
    <Card hover className="h-full">
      <Link to={to}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text hover:text-accent">{skill.name}</h3>
          {skill.level !== undefined && (
            <span className="text-sm text-text-muted">Lv.{skill.level}</span>
          )}
        </div>
      </Link>
      <div className="mb-3 flex flex-wrap gap-1">
        <Tag variant="accent">{skill.type}</Tag>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <p className="text-sm text-text-muted">
        <GlossaryTooltip text={skill.shortDesc} />
      </p>
    </Card>
  )
}
