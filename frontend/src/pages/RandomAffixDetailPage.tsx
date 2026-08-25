import { useParams, Link } from 'react-router-dom'
import { wikiData, getEntityBySlug } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'

export function RandomAffixDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const affix = getEntityBySlug(wikiData.randomAffixes, slug || '')

  if (!affix) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">未找到该随机词条</h2>
        <Link to="/random-affixes" className="mt-4 inline-block text-accent-cyan hover:underline">
          返回随机词条库
        </Link>
      </div>
    )
  }

  const occurrences = affix.occurrences || []

  return (
    <div>
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '随机词条', to: '/random-affixes' },
          { label: affix.name },
        ]}
      />

      <h1 className="mb-6 text-3xl font-bold text-text">{affix.name}</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="mb-4 text-xl font-bold text-text">效果</h2>
            <p className="text-text">
              <GlossaryTooltip text={affix.effect} />
            </p>
          </Card>

          <Card>
            <h2 className="mb-4 text-xl font-bold text-text">出现于</h2>
            {occurrences.length === 0 ? (
              <p className="text-text-muted">暂无记录。</p>
            ) : (
              <ul className="space-y-2">
                {occurrences.map((occ) => (
                  <li key={`${occ.equipmentId}-${occ.level}`}>
                    <Link
                      to={`/equipment/${occ.equipmentSlug}`}
                      className="text-accent-cyan hover:underline"
                    >
                      {occ.equipmentName}
                    </Link>
                    <span className="text-gold"> +{occ.level}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div>
          {affix.relatedGlossary && affix.relatedGlossary.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">相关术语</h2>
              <ul className="space-y-2">
                {affix.relatedGlossary.map((term) => {
                  const entry = wikiData.glossary.find((g) => g.term === term)
                  return (
                    <li key={term}>
                      {entry ? (
                        <Link
                          to={`/glossary#${entry.id}`}
                          className="text-accent-cyan hover:underline"
                        >
                          {term}
                        </Link>
                      ) : (
                        <span className="text-text-muted">{term}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
