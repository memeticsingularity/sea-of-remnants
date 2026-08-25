import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import { getEffectAtLevel } from '@/data'

interface SkillDescriptionProps {
  item: {
    shortDesc: string
    detailedDesc?: string
    levelDetails?: { level: number; detailedDesc: string }[]
  }
  selectedLevel: number
  showDetailed: boolean
  className?: string
}

export function SkillDescription({
  item,
  selectedLevel,
  showDetailed,
  className = '',
}: SkillDescriptionProps) {
  let text: string

  if (showDetailed) {
    const levelDesc = getEffectAtLevel({ levelDetails: item.levelDetails }, selectedLevel)
    if (levelDesc) {
      text = levelDesc
    } else if (item.detailedDesc && !item.levelDetails?.length) {
      // 旧格式：没有 levelDetails 时直接使用 detailedDesc
      text = item.detailedDesc
    } else {
      text = '该等级详细效果数据待补充'
    }
  } else {
    text = item.shortDesc
  }

  return (
    <p className={`leading-relaxed ${className}`}>
      <GlossaryTooltip text={text} />
    </p>
  )
}
