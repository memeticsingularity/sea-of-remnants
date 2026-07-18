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
  relatedGlossary?: string[]
  image?: string
  source?: string
  buildNotes?: string
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
  slot: string
  rarity: string
  enhance?: number
  maxEnhanceByFruitLevel?: MaxEnhanceEntry[]
  baseStats?: Record<string, number | string>
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

export interface Location {
  id: string
  slug: string
  name: string
  type: string
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
  pages: Page[]
  searchIndex: SearchIndexEntry[]
}
