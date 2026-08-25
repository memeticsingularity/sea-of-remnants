import { useParams, Link } from 'react-router-dom'
import { getEntityById } from '@/data'
import { useEntity, useCollection, invalidate } from '@/hooks/useCollection'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import { formatStatName } from '@/utils/format'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { NotFound } from '@/components/ui/NotFound'
import type { Equipment, RandomAffix } from '@/types'

export function EquipmentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { status, data: equipment, error } = useEntity<Equipment>('equipment', slug)
  const randomAffixesCollection = useCollection<RandomAffix>('randomAffixes')

  if (status === 'loading') return <Skeleton />
  if (status === 'error')
    return <ErrorState error={error} onRetry={() => invalidate(`equipment/${slug ?? ''}`)} />
  if (status === 'notfound' || !equipment)
    return <NotFound title="未找到该行装" backTo="/equipment" backLabel="返回行装列表" />

  const maxEnhanceLevel = equipment.slot === '奇珍' ? 0 : 10
  const statKeys = getAllStatKeys(equipment)

  return (
    <div>
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '行装', to: '/equipment' },
          { label: equipment.name },
        ]}
      />

      <div className="mb-6 flex items-start gap-4">
        {equipment.image ? (
          <img
            src={equipment.image}
            alt={equipment.name}
            className="h-24 w-24 rounded-lg bg-surface-light object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-surface-light text-text-dim">
            无图
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text">{equipment.name}</h1>
            {equipment.enhance !== undefined && (
              <span className="text-2xl font-bold text-gold">+{equipment.enhance}</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Tag variant="gold">{equipment.rarity}</Tag>
            <Tag>{equipment.slot}</Tag>
            {equipment.handType && <Tag variant="cyan">{equipment.handType}</Tag>}
            {equipment.set && <Tag variant="cyan">{equipment.set}</Tag>}
          </div>
          {equipment.source && (
            <p className="mt-2 text-sm text-text-muted">来源：{equipment.source}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {maxEnhanceLevel > 0 && statKeys.length > 0 && (
            <Card className="mb-6 overflow-x-auto">
              <h2 className="mb-4 text-xl font-bold text-text">属性成长表</h2>
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-2 py-2 text-left text-text-muted">强化等级</th>
                    {statKeys.map((key) => (
                      <th key={key} className="px-2 py-2 text-right text-text-muted">
                        {formatStatName(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxEnhanceLevel }, (_, i) => i + 1).map((level) => {
                    const stats = equipment.statsByLevel?.[level]
                    return (
                      <tr
                        key={level}
                        className={`border-b border-border/50 ${
                          level === 10 ? 'bg-accent/5' : ''
                        }`}
                      >
                        <td className="px-2 py-2 font-medium text-text">+{level}</td>
                        {statKeys.map((key) => {
                          const value = stats?.[key]
                          const isNegative =
                            typeof value === 'number'
                              ? value < 0
                              : String(value).startsWith('-')
                          return (
                            <td
                              key={key}
                              className={`px-2 py-2 text-right ${
                                isNegative ? 'text-negative' : 'text-text'
                              }`}
                            >
                              {value !== undefined ? formatStatValue(value) : '-'}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-text-muted">
                默认高亮 +10 行，缺失数据的等级显示为 “-”。
              </p>
            </Card>
          )}

          {equipment.baseStats && Object.keys(equipment.baseStats).length > 0 && maxEnhanceLevel === 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">基础属性</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(equipment.baseStats).map(([key, value]) => {
                  const isNegative =
                    typeof value === 'number'
                      ? value < 0
                      : String(value).startsWith('-')
                  return (
                    <div
                      key={key}
                      className="flex justify-between rounded-md border border-border bg-surface-light p-3"
                    >
                      <span className="text-text-muted">{formatStatName(key)}</span>
                      <span className={isNegative ? 'text-negative' : 'text-text'}>
                        {formatStatValue(value)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {equipment.fixedAffixes && equipment.fixedAffixes.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">固定词条</h2>
              <ul className="space-y-2">
                {equipment.fixedAffixes.map((affix, index) => (
                  <li key={index} className="flex gap-2 text-text">
                    <span className="text-accent">◆</span>
                    <GlossaryTooltip text={affix} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {equipment.randomAffixIds && equipment.randomAffixIds.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">可能出现的随机词条</h2>
              <ul className="space-y-2">
                {equipment.randomAffixIds.map((id) => {
                  const affix = getEntityById(randomAffixesCollection.data ?? [], id)
                  if (!affix) return null
                  return (
                    <li key={id} className="flex flex-wrap gap-2 text-text-muted">
                      <span>•</span>
                      <Link
                        to={`/random-affixes/${affix.slug}`}
                        className="text-accent-cyan hover:underline"
                      >
                        {affix.name}
                      </Link>
                      <span>—</span>
                      <GlossaryTooltip text={affix.effect} />
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}

          {equipment.randomAffixes && equipment.randomAffixes.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">可能出现的随机词条（旧格式）</h2>
              <ul className="space-y-2">
                {equipment.randomAffixes.map((affix, index) => (
                  <li key={index} className="flex gap-2 text-text-muted">
                    <span>•</span>
                    <GlossaryTooltip text={affix} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {equipment.setBonus && equipment.setBonus.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">套装效果</h2>
              <div className="space-y-2">
                {equipment.setBonus.map((bonus, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-border bg-surface-light p-3"
                  >
                    <span className="font-bold text-accent">{bonus.pieces}件套</span>
                    <p className="mt-1 text-text">{bonus.effect}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          {equipment.requirements && Object.keys(equipment.requirements).length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">穿戴要求</h2>
              <div className="space-y-2">
                {Object.entries(equipment.requirements).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between rounded-md border border-border bg-surface-light p-3"
                  >
                    <span className="text-text-muted">{formatStatName(key)}</span>
                    <span className="text-text">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {equipment.enhanceRequirements && equipment.enhanceRequirements.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">强化要求</h2>
              <div className="space-y-2">
                {equipment.enhanceRequirements.map((req) => (
                  <div
                    key={req.level}
                    className="rounded-md border border-border bg-surface-light p-3"
                  >
                    <div className="mb-1 font-bold text-text">强化 +{req.level}</div>
                    <div className="space-y-1 text-sm">
                      {Object.entries(req)
                        .filter(([key]) => key !== 'level')
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between text-text-muted">
                            <span>{formatStatName(key)}</span>
                            <span>{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {equipment.flavor && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">描述</h2>
              <p className="italic text-text-muted">{equipment.flavor}</p>
            </Card>
          )}

          {equipment.buildNotes && (
            <Card>
              <h2 className="mb-4 text-xl font-bold text-text">养成建议</h2>
              <div className="markdown-content text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {equipment.buildNotes}
                </ReactMarkdown>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function getAllStatKeys(equipment: { statsByLevel?: Record<string, Record<string, number | string>> }): string[] {
  const keys = new Set<string>()
  Object.values(equipment.statsByLevel || {}).forEach((stats) => {
    Object.keys(stats).forEach((key) => keys.add(key))
  })
  return Array.from(keys)
}

function formatStatValue(value: number | string | undefined): string {
  if (value === undefined) return '-'
  if (typeof value === 'number') {
    return value > 0 ? `+${value}` : String(value)
  }
  return String(value)
}
