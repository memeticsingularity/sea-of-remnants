import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { Skill } from '@/types'

interface SkillCardProps {
  skill: Skill
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link to={`/skills/${skill.slug}`}>
      <Card hover className="h-full">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text">{skill.name}</h3>
          {skill.level !== undefined && (
            <span className="text-sm text-text-muted">Lv.{skill.level}</span>
          )}
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          <Tag variant="accent">{skill.type}</Tag>
          {skill.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <p className="text-sm text-text-muted">
          <GlossaryTooltip text={skill.shortDesc} />
        </p>
      </Card>
    </Link>
  )
}
