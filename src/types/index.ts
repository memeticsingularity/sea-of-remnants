export interface GlossaryEntry {
  id: string
  term: string
  definition: string
  related?: string[]
}

export interface Skill {
  id: string
  slug: string
  name: string
  type: string
  class?: string
  level?: number
  maxLevel?: number
  shortDesc: string
  detailedDesc?: string
  tags: string[]
  extraActions?: number
  diceSlots?: DiceSlot[]
  relatedGlossary?: string[]
  image?: string
  source?: string
  buildNotes?: string
}

export interface DiceSlot {
  default: string
  alternatives: string[]
}

export interface Dice {
  id: string
  slug: string
  name: string
  type: string
  level?: number
  maxLevel?: number
  shortDesc: string
  detailedDesc?: string
  levelDetails?: DiceLevelDetail[]
  relatedGlossary?: string[]
  image?: string
  source?: string
  buildNotes?: string
}

export interface DiceLevelDetail {
  level: number
  detailedDesc: string
}

export interface Song {
  id: string
  slug: string
  name: string
  type: string
  effect: string
  relatedGlossary?: string[]
  image?: string
  source?: string
  buildNotes?: string
}

export interface Equipment {
  id: string
  slug: string
  name: string
  /** 行装栏位：手部 / 头部 / 躯干 / 腿部 / 奇珍 */
  slot: '手部' | '头部' | '躯干' | '腿部' | '奇珍'
  /** 手部装备的职业后缀，如 炼金壶、乐谱、枪械等 */
  handType?: string
  rarity: '绿' | '蓝' | '紫' | '金'
  /** 装备标签，如 攻击力、固定伤害系数 等 */
  tags?: string[]
  enhance?: number
  maxEnhanceByFruitLevel?: MaxEnhanceEntry[]
  baseStats?: Record<string, number | string>
  /** 各强化等级下的属性，key 为等级 1~10 */
  statsByLevel?: Record<string, Record<string, number | string>>
  requirements?: Record<string, number>
  enhanceRequirements?: EnhanceRequirementEntry[]
  fixedAffixes?: string[]
  randomAffixes?: string[]
  set?: string
  setBonus?: SetBonusEntry[]
  flavor?: string
  image?: string
  source?: string
  buildNotes?: string
}

export interface MaxEnhanceEntry {
  fruitLevel: number
  maxEnhance: number
}

export interface EnhanceRequirementEntry {
  level: number
  [stat: string]: number
}

export interface SetBonusEntry {
  pieces: number
  effect: string
}

export interface Crew {
  id: string
  slug: string
  name: string
  type: string
  rarity: string
  role?: string
  element?: string
  obtain?: string
  image?: string
  tags: string[]
  baseStats?: Record<string, number>
  skills?: string[]
  songs?: string[]
  recommendedEquipment?: string[]
  training?: TrainingPhase[]
  buildNotes?: string
}

export interface TrainingPhase {
  phase: string
  materials?: MaterialCost[]
  bonuses?: Record<string, string>
}

export interface MaterialCost {
  item: string
  count: number
}

export interface Ship {
  id: string
  slug: string
  name: string
  type: string
  tier?: string
  image?: string
  stats?: Record<string, number>
  upgrades?: ShipUpgrade[]
  buildNotes?: string
}

export interface ShipUpgrade {
  level: number
  cost?: Record<string, number>
  effects?: Record<string, number | string>
}

export interface GameClass {
  id: string
  slug: string
  name: string
  role?: string
  description?: string
  unlockCondition?: string
  skills?: string[]
  image?: string
  buildNotes?: string
}

export interface Item {
  id: string
  slug: string
  name: string
  type: string
  rarity?: string
  description?: string
  effect?: string
  image?: string
  source?: string
}

export interface Quest {
  id: string
  slug: string
  name: string
  category: string
  chapter?: number
  objectives?: string[]
  rewards?: MaterialCost[]
  location?: string
  description?: string
}

export interface Symptom {
  id: string
  slug: string
  name: string
  /** 严重程度：轻症 / 中症 / 重症 */
  severity: string
  /** 正向 / 负面 */
  alignment?: string
  effect: string
  source?: string
  analysis?: string
  pathology?: Record<string, number>
  trend?: string
  treatment?: string
  image?: string
}

export interface Location {
  id: string
  slug: string
  name: string
  type: '海域' | '区域' | '地点'
  region?: string
  description?: string
  enemies?: string[]
  drops?: string[]
}

export interface Page {
  id: string
  title: string
  route: string
  markdown: string
  content?: string
}

export interface SearchIndexEntry {
  id: string
  title: string
  type: string
  route: string
  tags?: string[]
  keywords?: string[]
}

export interface Shadow {
  id: string
  slug: string
  name: string
  type: '往日之影'
  rarity: '黑' | '紫' | '蓝'
  description?: string
  tags?: string[]
  image?: string
  source?: string
}

export interface RecruitmentPool {
  id: string
  slug: string
  name: string
  bannerName: string
  type: 'limited' | 'standard' | 'weekly'
  currency: string
  singleCost: number
  tenCost: number
  tiers: RecruitmentTier[]
  upItems: {
    crewIds?: string[]
    shadowIds?: string[]
    upRate?: number
    guaranteeNextOnMiss?: boolean
  }[]
  pityRules: PityRule[]
}

export interface RecruitmentTier {
  key: 'black' | 'purple' | 'blue'
  label: string
  baseRate: number
  comprehensiveRate: number
  hardPity?: number
  pool: {
    crewIds: string[]
    shadowIds: string[]
  }
  mixed?: boolean
}

export interface PityRule {
  type: 'hard_pity' | 'purple_guarantee' | 'up_guarantee'
  threshold: number
  tier: 'black' | 'purple'
  firstUpId?: string
  guaranteeUpAfterMiss?: boolean
}

export interface WikiData {
  meta: {
    version: string
    generatedAt: string
  }
  crews: Crew[]
  ships: Ship[]
  classes: GameClass[]
  skills: Skill[]
  dice: Dice[]
  songs: Song[]
  equipment: Equipment[]
  items: Item[]
  quests: Quest[]
  locations: Location[]
  glossary: GlossaryEntry[]
  symptoms: Symptom[]
  shadows: Shadow[]
  recruitmentPools: RecruitmentPool[]
  pages: Page[]
  searchIndex: SearchIndexEntry[]
}
