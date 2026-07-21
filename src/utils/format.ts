export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

const statNameMap: Record<string, string> = {
  // 基础属性
  hp: '生命',
  atk: '攻击',
  def: '防御',
  spd: '速度',
  // 扩展属性
  int: '智力',
  per: '感知',
  str: '力量',
  agi: '敏捷',
  cha: '魅力',
  con: '体质',
  // 战斗属性
  critRate: '暴击率',
  critDamage: '暴击伤害',
  effectHit: '效果命中',
  effectResist: '效果抵抗',
  dotBoost: '持续伤害提升',
  fixedDamage: '固定伤害',
  damageBoost: '伤害提升',
  breakDamageBoost: '击破伤害提升',
  // 防御/辅助属性
  shieldEffect: '护盾效果',
  threat: '受击权重',
  damageReduce: '伤害减免',
  healBoost: '治疗效果',
  // 能量/资源
  energy: '能量',
  hpGainEfficiency: '体力获取效率',
  // 船只属性
  hull: '船体',
  sails: '风帆',
  cargo: '货舱',
  crewCapacity: '船员容量',
}

export function formatStatName(key: string): string {
  return statNameMap[key] || key
}
