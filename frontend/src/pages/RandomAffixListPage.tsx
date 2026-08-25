import { wikiData } from '@/data'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { RandomAffixCard } from '@/components/cards/RandomAffixCard'

export function RandomAffixListPage() {
  const affixes = [...wikiData.randomAffixes].sort((a, b) => {
    const countA = a.occurrences?.length || 0
    const countB = b.occurrences?.length || 0
    if (countB !== countA) return countB - countA
    return a.name.localeCompare(b.name, 'zh-CN')
  })

  return (
    <div>
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '随机词条' },
        ]}
      />
      <h1 className="mb-6 text-3xl font-bold text-text">随机词条库</h1>

      <p className="mb-4 text-sm text-text-muted">共 {affixes.length} 条随机词条</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {affixes.map((affix) => (
          <RandomAffixCard key={affix.id} affix={affix} />
        ))}
      </div>
    </div>
  )
}
