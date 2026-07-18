import { useState, useMemo } from 'react'
import { wikiData } from '@/data'
import { CrewCard } from '@/components/cards/CrewCard'
import { SkillCard } from '@/components/cards/SkillCard'
import { EquipmentCard } from '@/components/cards/EquipmentCard'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import type { Crew, Skill, Equipment, Ship, GameClass, Song, Item, Quest, Location } from '@/types'

type CategoryKey =
  | 'crews'
  | 'ships'
  | 'classes'
  | 'skills'
  | 'dice'
  | 'songs'
  | 'equipment'
  | 'items'
  | 'quests'
  | 'locations'

interface CategoryPageProps {
  category: CategoryKey
}

const categoryLabels: Record<CategoryKey, string> = {
  crews: '船员',
  ships: '船只',
  classes: '职业',
  skills: '技能',
  dice: '骰子',
  songs: '船歌',
  equipment: '行装',
  items: '物品',
  quests: '任务',
  locations: '地点',
}

interface FilterConfig {
  key: string
  label: string
  getValue: (item: unknown) => string | string[] | undefined
}

const filterConfigs: Record<CategoryKey, FilterConfig[]> = {
  crews: [
    { key: 'rarity', label: '稀有度', getValue: (i) => (i as Crew).rarity },
    { key: 'role', label: '定位', getValue: (i) => (i as Crew).role },
    { key: 'element', label: '元素', getValue: (i) => (i as Crew).element },
  ],
  ships: [
    { key: 'type', label: '类型', getValue: (i) => (i as Ship).type },
    { key: 'tier', label: ' tier', getValue: (i) => (i as Ship).tier },
  ],
  classes: [
    { key: 'role', label: '定位', getValue: (i) => (i as GameClass).role },
  ],
  skills: [
    { key: 'type', label: '类型', getValue: (i) => (i as Skill).type },
    { key: 'tags', label: '标签', getValue: (i) => (i as Skill).tags },
  ],
  dice: [
    { key: 'type', label: '类型', getValue: (i) => (i as Skill).type },
  ],
  songs: [],
  equipment: [
    { key: 'slot', label: '栏位', getValue: (i) => (i as Equipment).slot },
    { key: 'handType', label: '手部类型', getValue: (i) => (i as Equipment).handType },
    { key: 'rarity', label: '稀有度', getValue: (i) => (i as Equipment).rarity },
  ],
  items: [
    { key: 'type', label: '类型', getValue: (i) => (i as Item).type },
    { key: 'rarity', label: '稀有度', getValue: (i) => (i as Item).rarity },
  ],
  quests: [
    { key: 'category', label: '分类', getValue: (i) => (i as Quest).category },
  ],
  locations: [
    { key: 'type', label: '类型', getValue: (i) => (i as Location).type },
    { key: 'region', label: '所属区域', getValue: (i) => (i as Location).region },
  ],
}

export function CategoryPage({ category }: CategoryPageProps) {
  const items = wikiData[category]
  const configs = filterConfigs[category]
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filteredItems = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return items
    return items.filter((item) => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true
        const config = configs.find((c) => c.key === key)
        if (!config) return true
        const itemValue = config.getValue(item)
        if (Array.isArray(itemValue)) {
          return itemValue.includes(value)
        }
        return itemValue === value
      })
    })
  }, [items, activeFilters, configs])

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      if (prev[key] === value) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value }
    })
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: '首页', to: '/' }, { label: categoryLabels[category] }]}
      />
      <h1 className="mb-6 text-3xl font-bold text-text">{categoryLabels[category]}</h1>

      {configs.length > 0 && (
        <Card className="mb-6">
          <div className="flex flex-wrap gap-6">
            {configs.map((config) => (
              <FilterGroup
                key={config.key}
                config={config}
                items={items}
                activeValue={activeFilters[config.key]}
                onSelect={(value) => toggleFilter(config.key, value)}
              />
            ))}
          </div>
        </Card>
      )}

      {filteredItems.length === 0 ? (
        <Card>
          <p className="text-text-muted">没有符合筛选条件的数据。</p>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-text-muted">共 {filteredItems.length} 条结果</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => renderItemCard(category, item))}
          </div>
        </>
      )}
    </div>
  )
}

interface FilterGroupProps {
  config: FilterConfig
  items: unknown[]
  activeValue?: string
  onSelect: (value: string) => void
}

function FilterGroup({ config, items, activeValue, onSelect }: FilterGroupProps) {
  const values = useMemo(() => {
    const set = new Set<string>()
    for (const item of items) {
      const value = config.getValue(item)
      if (Array.isArray(value)) {
        value.forEach((v) => v && set.add(v))
      } else if (value) {
        set.add(value)
      }
    }
    return Array.from(set).sort()
  }, [items, config])

  if (values.length <= 1) return null

  return (
    <div className="min-w-[120px]">
      <div className="mb-2 text-sm font-medium text-text-muted">{config.label}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              activeValue === value
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-muted hover:border-accent/50 hover:text-text'
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}

function renderItemCard(category: CategoryKey, item: unknown) {
  switch (category) {
    case 'crews':
      return <CrewCard key={(item as Crew).id} crew={item as Crew} />
    case 'skills':
    case 'dice':
      return <SkillCard key={(item as Skill).id} skill={item as Skill} />
    case 'equipment':
      return (
        <EquipmentCard key={(item as Equipment).id} equipment={item as Equipment} />
      )
    case 'ships':
      return (
        <SimpleCard
          key={(item as Ship).id}
          title={(item as Ship).name}
          subtitle={(item as Ship).type}
        />
      )
    case 'classes':
      return (
        <SimpleCard
          key={(item as GameClass).id}
          title={(item as GameClass).name}
          subtitle={(item as GameClass).role}
        />
      )
    case 'songs':
      return <SimpleCard key={(item as Song).id} title={(item as Song).name} subtitle="船歌" />
    case 'items':
      return (
        <SimpleCard
          key={(item as Item).id}
          title={(item as Item).name}
          subtitle={(item as Item).type}
        />
      )
    case 'quests':
      return (
        <SimpleCard
          key={(item as Quest).id}
          title={(item as Quest).name}
          subtitle={(item as Quest).category}
        />
      )
    case 'locations':
      return (
        <SimpleCard
          key={(item as Location).id}
          title={(item as Location).name}
          subtitle={(item as Location).type}
        />
      )
    default:
      return null
  }
}

function SimpleCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-text">{title}</h3>
      {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
    </Card>
  )
}
