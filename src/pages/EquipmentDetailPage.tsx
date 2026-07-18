import { useParams, Link } from 'react-router-dom'
import { wikiData, getEntityBySlug } from '@/data'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function EquipmentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const equipment = getEntityBySlug(wikiData.equipment, slug || '')

  if (!equipment) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">未找到该行装</h2>
        <Link to="/equipment" className="mt-4 inline-block text-accent-cyan hover:underline">
          返回行装列表
        </Link>
      </div>
    )
  }

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
            {equipment.set && <Tag variant="cyan">{equipment.set}</Tag>}
          </div>
          {equipment.source && (
            <p className="mt-2 text-sm text-text-muted">来源：{equipment.source}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {equipment.baseStats && Object.keys(equipment.baseStats).length > 0 && (
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

          {equipment.randomAffixes && equipment.randomAffixes.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">可能出现的随机词条</h2>
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

function formatStatName(key: string): string {
  const names: Record<string, string> = {
    hp: '生命',
    atk: '攻击',
    def: '防御',
    spd: '速度',
    int: '智力',
    per: '感知',
    dotBoost: '持续伤害提升',
    hull: '船体',
    sails: '风帆',
    cargo: '货舱',
    crewCapacity: '船员容量',
  }
  return names[key] || key
}

function formatStatValue(value: number | string | undefined): string {
  if (value === undefined) return '-'
  if (typeof value === 'number') {
    return value > 0 ? `+${value}` : String(value)
  }
  return String(value)
}
