import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { wikiData, getEntityBySlug } from '@/data'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'

export function DiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [showDetailed, setShowDetailed] = useState(false)

  const dice = getEntityBySlug(wikiData.dice, slug || '')

  if (!dice) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">未找到</h2>
        <Link
          to="/dice"
          className="mt-4 inline-block text-accent-cyan hover:underline"
        >
          返回强化骰列表
        </Link>
      </div>
    )
  }

  const desc = showDetailed && dice.detailedDesc ? dice.detailedDesc : dice.shortDesc

  return (
    <div>
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '强化骰', to: '/dice' },
          { label: dice.name },
        ]}
      />

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          {dice.image ? (
            <img
              src={dice.image}
              alt={dice.name}
              className="h-20 w-20 rounded-lg bg-surface-light object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface-light text-text-dim">
              无图
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-text">{dice.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag variant="accent">{dice.type}</Tag>
              {dice.level !== undefined && (
                <Tag variant="cyan">等级 {dice.level}/{dice.maxLevel}</Tag>
              )}
            </div>
          </div>
        </div>

        {dice.detailedDesc && (
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
            {dice.detailedDesc && (
              <p className="mt-2 text-xs text-text-muted">
                {showDetailed ? '当前为详细描述' : '当前为简略描述，点击右上角切换'}
              </p>
            )}
          </Card>

          {dice.levelDetails && dice.levelDetails.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">等级详情</h2>
              <div className="space-y-3">
                {dice.levelDetails.map((detail) => (
                  <div
                    key={detail.level}
                    className="rounded-md border border-border bg-surface-light p-3"
                  >
                    <div className="mb-1 text-sm font-medium text-accent">
                      等级 {detail.level}
                    </div>
                    <p className="text-sm leading-relaxed text-text">
                      <GlossaryTooltip text={detail.detailedDesc} />
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          {dice.relatedGlossary && dice.relatedGlossary.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">相关术语</h2>
              <div className="flex flex-wrap gap-2">
                {dice.relatedGlossary.map((term) => {
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

          {dice.buildNotes && (
            <Card>
              <h2 className="mb-4 text-xl font-bold text-text">搭配建议</h2>
              <div className="markdown-content text-sm">{dice.buildNotes}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
