import { MAIN_ATTRIBUTES } from '@/hooks/usePartyConfig'
import type { MainAttribute, PartyConfig } from '@/hooks/usePartyConfig'

export function getPartyMainAttrs(party: PartyConfig): MainAttribute[] {
  return party.slots
    .map((s) => s.mainAttr)
    .filter((a): a is MainAttribute => a !== '' && a !== undefined)
}

export interface TriggerResult {
  trigger: boolean
  reason: string
}

export function evaluateGuardianTrigger(
  effect: string,
  party: PartyConfig,
): TriggerResult {
  const attrs = getPartyMainAttrs(party)

  if (attrs.length === 0) {
    return { trigger: false, reason: '未配置队伍主属性' }
  }

  // 检查「X 个船员主属性互不相同」类条件
  const distinctMatch = effect.match(/(\d)\s*个.*主属性.*不相同/)
  if (distinctMatch) {
    const need = parseInt(distinctMatch[1], 10)
    const distinct = new Set(attrs).size
    return {
      trigger: distinct >= need,
      reason: `主属性种类 ${distinct}/${need}`,
    }
  }

  // 检查是否需要特定属性系（如力量系、体质系）
  const required = MAIN_ATTRIBUTES.filter((attr) =>
    effect.includes(`${attr}系`),
  )

  if (required.length > 0) {
    const missing = required.filter((r) => !attrs.includes(r))
    if (missing.length === 0) {
      return {
        trigger: true,
        reason: `队伍包含 ${required.join('、')}`,
      }
    }
    return {
      trigger: false,
      reason: `缺少 ${missing.join('、')}`,
    }
  }

  return { trigger: true, reason: '无条件触发' }
}
