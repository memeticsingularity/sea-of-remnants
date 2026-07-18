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

export function CategoryPage({ category }: CategoryPageProps) {
  const items = wikiData[category]

  return (
    <div>
      <Breadcrumb items={[{ label: '首页', to: '/' }, { label: categoryLabels[category] }]} />
      <h1 className="mb-6 text-3xl font-bold text-text">{categoryLabels[category]}</h1>

      {items.length === 0 ? (
        <Card>
          <p className="text-text-muted">该分类下暂无数据，敬请期待补充。</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => renderItemCard(category, item))}
        </div>
      )}
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
      return <EquipmentCard key={(item as Equipment).id} equipment={item as Equipment} />
    case 'ships':
      return <SimpleCard key={(item as Ship).id} title={(item as Ship).name} subtitle={(item as Ship).type} />
    case 'classes':
      return <SimpleCard key={(item as GameClass).id} title={(item as GameClass).name} subtitle={(item as GameClass).role} />
    case 'songs':
      return <SimpleCard key={(item as Song).id} title={(item as Song).name} subtitle="船歌" />
    case 'items':
      return <SimpleCard key={(item as Item).id} title={(item as Item).name} subtitle={(item as Item).type} />
    case 'quests':
      return <SimpleCard key={(item as Quest).id} title={(item as Quest).name} subtitle={(item as Quest).category} />
    case 'locations':
      return <SimpleCard key={(item as Location).id} title={(item as Location).name} subtitle={(item as Location).type} />
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
