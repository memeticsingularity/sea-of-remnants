import { useParams } from 'react-router-dom'
import { useEntity, invalidate } from '@/hooks/useCollection'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { NotFound } from '@/components/ui/NotFound'
import type { Symptom } from '@/types'

export function SymptomDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { status, data: symptom, error } = useEntity<Symptom>('symptoms', slug)

  if (status === 'loading') return <Skeleton />
  if (status === 'error')
    return <ErrorState error={error} onRetry={() => invalidate(`symptoms/${slug ?? ''}`)} />
  if (status === 'notfound' || !symptom)
    return <NotFound title="未找到该症状" backTo="/symptoms" backLabel="返回症状列表" />

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '症状', to: '/symptoms' },
          { label: symptom.name },
        ]}
      />

      <div className="mb-6 flex items-start gap-4">
        {symptom.image ? (
          <img
            src={symptom.image}
            alt={symptom.name}
            className="h-24 w-24 rounded-lg bg-surface-light object-cover"
          />        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-surface-light text-text-dim">
            无图
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-text">{symptom.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Tag variant="accent">{symptom.severity}</Tag>
            {symptom.alignment && <Tag>{symptom.alignment}</Tag>}
            {symptom.source && <Tag variant="cyan">{symptom.source}</Tag>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-3 text-xl font-bold text-text">效果</h2>
          <p className="text-lg text-text">{symptom.effect}</p>
        </Card>

        {symptom.analysis && (
          <Card>
            <h2 className="mb-3 text-xl font-bold text-text">病情分析</h2>
            <p className="text-text">{symptom.analysis}</p>
          </Card>
        )}

        {symptom.pathology && Object.keys(symptom.pathology).length > 0 && (
          <Card>
            <h2 className="mb-3 text-xl font-bold text-text">病理分析</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(symptom.pathology).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between rounded-md border border-border bg-surface-light p-3"
                >
                  <span className="text-text-muted">{key}</span>
                  <span className="text-accent-cyan">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {symptom.trend && (
          <Card>
            <h2 className="mb-3 text-xl font-bold text-text">病症趋势</h2>
            <p className="text-text">{symptom.trend}</p>
          </Card>
        )}

        {symptom.treatment && (
          <Card>
            <h2 className="mb-3 text-xl font-bold text-text">治疗方式</h2>
            <p className="text-text">{symptom.treatment}</p>
          </Card>
        )}
      </div>
    </div>
  )
}
