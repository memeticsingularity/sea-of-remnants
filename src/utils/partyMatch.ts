export const MAIN_ATTRIBUTES = [
  '力量',
  '体质',
  '敏捷',
  '智力',
  '魅力',
  '感知',
] as const

export type MainAttribute = (typeof MAIN_ATTRIBUTES)[number]

export function getRequiredAttributes(effect: string): MainAttribute[] {
  return MAIN_ATTRIBUTES.filter((attr) => effect.includes(`${attr}系`))
}

export function hasDistinctAttributes(
  effect: string,
): { required: number } | null {
  const match = effect.match(/(\d)\s*个.*主属性.*不相同/)
  if (!match) return null
  return { required: parseInt(match[1], 10) }
}

export interface TriggerResult {
  trigger: boolean
  reason: string
  required: MainAttribute[]
}

export function evaluateGuardianTrigger(
  effect: string,
  partyAttrs: string[],
): TriggerResult {
  const required = getRequiredAttributes(effect)

  if (partyAttrs.length === 0) {
    return {
      trigger: required.length === 0,
      reason: '未配置队伍',
      required,
    }
  }

  const distinct = hasDistinctAttributes(effect)
  if (distinct) {
    const uniqueCount = new Set(partyAttrs).size
    return {
      trigger: uniqueCount >= distinct.required,
      reason: `主属性种类 ${uniqueCount}/${distinct.required}`,
      required,
    }
  }

  if (required.length > 0) {
    const missing = required.filter((r) => !partyAttrs.includes(r))
    if (missing.length === 0) {
      return {
        trigger: true,
        reason: `队伍包含 ${required.join('、')}`,
        required,
      }
    }
    return {
      trigger: false,
      reason: `缺少 ${missing.join('、')}`,
      required,
    }
  }

  return { trigger: true, reason: '无条件触发', required: [] }
}
