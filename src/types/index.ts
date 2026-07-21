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
  /** 旧格式：直接写词条文本；保留做兼容 */
  randomAffixes?: string[]
  /** 新格式：引用 random-affixes 库的 ID */
  randomAffixIds?: string[]
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

export interface RandomAffix {
  id: string
  slug: string
  name: string
  effect: string
  relatedGlossary?: string[]
  source?: string
  buildNotes?: string
  /** 由 build-content.js 根据装备引用自动生成 */
  occurrences?: RandomAffixOccurrence[]
}

export interface RandomAffixOccurrence {
  equipmentId: string
  equipmentSlug: string
  equipmentName: string
  level: number
}

export interface Crew {
  id: string
  slug: string
  name: string
  type: string
  rarity: string
  role?: string
  element?: string
  /** 主属性：力量 / 敏捷 / 体质 / 智力 / 感知 / 魅力 */
  primaryStat?: string
  /** 船队/阵营 */
  faction?: string
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
  /** 战斗定位标签，如 主攻 / 协攻 / 辅助 */
  combatRoles?: string[]
  description?: string
  unlockCondition?: string
  skills?: string[]
  songs?: string[]
  image?: string
  /** 被动技能 */
  passives?: ClassPassive[]
  /** 职业属性提升说明 */
  attributeBoost?: string
  /** 标签要求 */
  tagRequirement?: TagRequirement
  /** 习得后获得天赋点 */
  talentPoints?: number
  /** 六维等属性强化 */
  statBoosts?: Record<string, string>
  buildNotes?: string
}

export interface ClassPassive {
  name: string
  level: number
  effect: string
}

export interface TagRequirement {
  tag: string
  required: number
  owned?: number
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

export interface Guardian {
  id: string
  slug: string
  name: string
  category: '战技特化' | '潜能特化' | '船员培养'
  rarity: '金' | '紫' | '蓝'
  set?: string
  tags: GuardianTag[]
  effect: string
  relatedGlossary?: string[]
  image?: string
  buildNotes?: string
}

export interface GuardianTag {
  name: string
  count: number
}

export interface ShipTag {
  id: string
  slug: string
  name: string
  description?: string
  levels: ShipTagLevel[]
}

export interface ShipTagLevel {
  count: number
  effect: string
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
  roseStoneCost: number
  tiers: RecruitmentTier[]
  upItems: {
    crewIds?: string[]
    shadowIds?: string[]
    upRate?: number
    guaranteeNextOnMiss?: boolean
  }[]
  pityRules: PityRule[]
  rules?: string
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
  randomAffixes: RandomAffix[]
  items: Item[]
  quests: Quest[]
  locations: Location[]
  glossary: GlossaryEntry[]
  symptoms: Symptom[]
  shadows: Shadow[]
  recruitmentPools: RecruitmentPool[]
  guardians: Guardian[]
  shipTags: ShipTag[]
  pages: Page[]
  searchIndex: SearchIndexEntry[]
}
