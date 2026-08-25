import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { SkillLevelSelector } from '@/components/skills/SkillLevelSelector'
import { SkillDescription } from '@/components/skills/SkillDescription'
import { SkillDetailToggle } from '@/components/skills/SkillDetailToggle'
import { getAvailableLevels } from '@/data'
import type { Skill } from '@/types'

interface SkillCardProps {
  skill: Skill
  compact?: boolean
}

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const availableLevels = getAvailableLevels(skill)
  const defaultLevel = availableLevels[0] ?? skill.level ?? 1
  const [selectedLevel, setSelectedLevel] = useState(defaultLevel)
  const [showDetailed, setShowDetailed] = useState(false)

  const hasDetailed = Boolean(skill.detailedDesc || skill.levelDetails?.length)

  return (
    <Card hover className="h-full">
      <Link to={`/skills/${skill.slug}`}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text hover:text-accent">{skill.name}</h3>
          {skill.level !== undefined && (
            <span className="text-sm text-text-muted">Lv.{skill.level}</span>
          )}
        </div>
      </Link>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          <Tag variant="accent">{skill.type}</Tag>
          {skill.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        {hasDetailed && (
          <SkillDetailToggle
            showDetailed={showDetailed}
            onToggle={() => setShowDetailed((v) => !v)}
          />
        )}
      </div>

      <SkillLevelSelector
        item={skill}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        size={compact ? 'sm' : 'md'}
      />

      <div className={`mt-3 text-sm ${showDetailed ? 'text-text' : 'text-text-muted'}`}>
        <SkillDescription
          item={skill}
          selectedLevel={selectedLevel}
          showDetailed={showDetailed}
        />
      </div>
    </Card>
  )
}
