import { useParams, Link } from 'react-router-dom'
import { getEntityById } from '@/data'
import { useEntity, useCollection, invalidate } from '@/hooks/useCollection'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { StatBlock } from '@/components/ui/StatBlock'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SkillCard } from '@/components/cards/SkillCard'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { NotFound } from '@/components/ui/NotFound'
import type { Crew, Skill, Song, Equipment } from '@/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function CrewDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { status, data: crew, error } = useEntity<Crew>('crews', slug)
  const skillsCollection = useCollection<Skill>('skills')
  const songsCollection = useCollection<Song>('songs')
  const equipmentCollection = useCollection<Equipment>('equipment')

  const skills = crew?.skills
    ?.map((id) => getEntityById(skillsCollection.data ?? [], id))
    .filter(Boolean)
  const songs = crew?.songs
    ?.map((id) => getEntityById(songsCollection.data ?? [], id))
    .filter(Boolean)
  const equipment = crew?.recommendedEquipment
    ?.map((id) => getEntityById(equipmentCollection.data ?? [], id))
    .filter(Boolean)

  if (status === 'loading') return <Skeleton />
  if (status === 'error') return <ErrorState error={error} onRetry={() => invalidate(`crews/${slug ?? ''}`)} />
  if (status === 'notfound' || !crew)
    return <NotFound title="未找到该船员" backTo="/crews" backLabel="返回船员列表" />

  return (
    <div>
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '船员', to: '/crews' },
          { label: crew.name },
        ]}
      />

      <div className="mb-6 flex items-start gap-4">
        {crew.image ? (
          <img
            src={crew.image}
            alt={crew.name}
            className="h-24 w-24 rounded-lg bg-surface-light object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-surface-light text-text-dim">
            无图
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-text">{crew.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Tag variant={crew.rarity === 'SSR' ? 'gold' : 'accent'}>
              {crew.rarity === 'SSR' ? '黑券' : crew.rarity === 'SR' ? '紫券' : crew.rarity}
            </Tag>
            {crew.primaryStat && <Tag>{crew.primaryStat}</Tag>}
            {crew.faction && <Tag variant="cyan">{crew.faction}</Tag>}
            {crew.obtain && <Tag variant="accent">{crew.obtain}</Tag>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="mb-4 text-xl font-bold text-text">基础属性</h2>
            <StatBlock stats={crew.baseStats} />
          </Card>

          {skills && skills.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">职业技能</h2>
              <div className="grid gap-4">
                {skills.map((skill) => (
                  <SkillCard key={skill!.id} skill={skill!} compact />
                ))}
              </div>
            </Card>
          )}

          {equipment && equipment.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">推荐行装</h2>
              <div className="space-y-3">
                {equipment.map((equip) => (
                  <Link
                    key={equip!.id}
                    to={`/equipment/${equip!.slug}`}
                    className="block rounded-md border border-border bg-surface-light p-3 hover:border-accent"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">{equip!.name}</span>
                      <span className="text-sm text-text-muted">{equip!.slot}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          {songs && songs.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">船歌</h2>
              <div className="space-y-3">
                {songs.map((song) => (
                  <div
                    key={song!.id}
                    className="rounded-md border border-border bg-surface-light p-3"
                  >
                    <span className="font-bold text-text">{song!.name}</span>
                    <p className="mt-1 text-sm text-text-muted">
                      <GlossaryTooltip text={song!.effect} />
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {crew.buildNotes && (
            <Card>
              <h2 className="mb-4 text-xl font-bold text-text">养成建议</h2>
              <div className="markdown-content text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {crew.buildNotes}
                </ReactMarkdown>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
