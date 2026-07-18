import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { wikiData, getEntityBySlug } from '@/data'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import type { Skill, Dice } from '@/types'

interface SkillDetailPageProps {
  type?: 'skill' | 'dice'
}

export function SkillDetailPage({ type = 'skill' }: SkillDetailPageProps) {
  const { slug } = useParams<{ slug: string }>()
  const [showDetailed, setShowDetailed] = useState(false)

  const collection = type === 'dice' ? wikiData.dice : wikiData.skills
  const item = getEntityBySlug(collection as (Skill | Dice)[], slug || '')

  if (!item) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">未找到</h2>
        <Link
          to={type === 'dice' ? '/dice' : '/skills'}
          className="mt-4 inline-block text-accent-cyan hover:underline"
        >
          返回列表
        </Link>
      </div>
    )
  }

  const isSkill = 'tags' in item
  const label = type === 'dice' ? '骰子' : '技能'
  const listPath = type === 'dice' ? '/dice' : '/skills'

  const desc = showDetailed && item.detailedDesc ? item.detailedDesc : item.shortDesc

  return (
    <div>
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label, to: listPath },
          { label: item.name },
        ]}
      />

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-lg bg-surface-light object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface-light text-text-dim">
              无图
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-text">{item.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag variant="accent">{item.type}</Tag>
              {isSkill && (item as Skill).tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              {item.level !== undefined && (
                <Tag variant="cyan">等级 {item.level}/{item.maxLevel}</Tag>
              )}
            </div>
          </div>
        </div>

        {item.detailedDesc && (
          <button
            type="button"
            onClick={() => setShowDetailed(!showDetailed)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              showDetailed
                ? 'bg-accent text-white'
                : 'bg-surface-light text-text-muted hover:text-text'
            }`}
          >
            {showDetailed ? '简略' : '详细'}
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="mb-4 text-xl font-bold text-text">效果说明</h2>
            <p className="text-lg leading-relaxed text-text">
              <GlossaryTooltip text={desc} />
            </p>
            {item.detailedDesc && (
              <p className="mt-2 text-xs text-text-muted">
                {showDetailed ? '当前为详细描述' : '当前为简略描述，点击右上角切换'}
              </p>
            )}
          </Card>

          {isSkill && (item as Skill).diceSlots && (item as Skill).diceSlots!.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">可配置骰子</h2>
              <div className="space-y-3">
                {(item as Skill).diceSlots!.map((slot, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-border bg-surface-light p-3"
                  >
                    <div className="mb-1 text-sm text-text-muted">槽位 {index + 1}</div>
                    <div className="flex flex-wrap gap-2">
                      {slot.alternatives.map((diceName) => {
                        const dice = wikiData.dice.find((d) => d.name === diceName)
                        return dice ? (
                          <Link
                            key={diceName}
                            to={`/dice/${dice.slug}`}
                            className={`rounded-full border px-3 py-1 text-sm ${
                              diceName === slot.default
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border bg-surface text-text-muted hover:text-text'
                            }`}
                          >
                            {diceName}
                          </Link>
                        ) : (
                          <span
                            key={diceName}
                            className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-muted"
                          >
                            {diceName}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          {item.relatedGlossary && item.relatedGlossary.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">相关术语</h2>
              <div className="flex flex-wrap gap-2">
                {item.relatedGlossary.map((term) => {
                  const entry = wikiData.glossary.find((g) => g.term === term)
                  return entry ? (
                    <Link
                      key={term}
                      to={`/glossary#${entry.id}`}
                      className="rounded-md border border-border bg-surface-light px-3 py-1.5 text-sm text-text hover:border-accent-cyan hover:text-accent-cyan"
                    >
                      {term}
                    </Link>
                  ) : (
                    <span
                      key={term}
                      className="rounded-md border border-border bg-surface-light px-3 py-1.5 text-sm text-text-muted"
                    >
                      {term}
                    </span>
                  )
                })}
              </div>
            </Card>
          )}

          {item.buildNotes && (
            <Card>
              <h2 className="mb-4 text-xl font-bold text-text">搭配建议</h2>
              <div className="markdown-content text-sm">{item.buildNotes}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
