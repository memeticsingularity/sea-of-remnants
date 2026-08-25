import { useParams, Link } from 'react-router-dom'
import { useEntity, useCollection, invalidate } from '@/hooks/useCollection'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { NotFound } from '@/components/ui/NotFound'
import type { RandomAffix, GlossaryEntry } from '@/types'

export function RandomAffixDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { status, data: affix, error } = useEntity<RandomAffix>('randomAffixes', slug)
  const glossaryCollection = useCollection<GlossaryEntry>('glossary')

  if (status === 'loading') return <Skeleton />
  if (status === 'error')
    return <ErrorState error={error} onRetry={() => invalidate(`randomAffixes/${slug ?? ''}`)} />
  if (status === 'notfound' || !affix)
    return <NotFound title="未找到该随机词条" backTo="/random-affixes" backLabel="返回随机词条库" />

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
                  const entry = glossaryCollection.data?.find((g) => g.term === term)
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
