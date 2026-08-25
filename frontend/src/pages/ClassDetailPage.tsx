import { useParams } from 'react-router-dom'
import { getEntityById } from '@/data'
import { useEntity, useCollection, invalidate } from '@/hooks/useCollection'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SkillCard } from '@/components/cards/SkillCard'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { NotFound } from '@/components/ui/NotFound'
import type { GameClass, Skill, Song } from '@/types'

export function ClassDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { status, data: gameClass, error } = useEntity<GameClass>('classes', slug)
  const skillsCollection = useCollection<Skill>('skills')
  const songsCollection = useCollection<Song>('songs')

  const skills = gameClass?.skills
    ?.map((id) => getEntityById(skillsCollection.data ?? [], id))
    .filter(Boolean)
  const songs = gameClass?.songs
    ?.map((id) => getEntityById(songsCollection.data ?? [], id))
    .filter(Boolean)

  if (status === 'loading') return <Skeleton />
  if (status === 'error')
    return <ErrorState error={error} onRetry={() => invalidate(`classes/${slug ?? ''}`)} />
  if (status === 'notfound' || !gameClass)
    return <NotFound title="未找到该职业" backTo="/classes" backLabel="返回职业列表" />

  return (
    <div>
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '职业', to: '/classes' },
          { label: gameClass.name },
        ]}
      />

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-surface-light text-3xl font-bold text-accent">
          {gameClass.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text">{gameClass.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {gameClass.tier && <Tag variant="gold">{gameClass.tier}</Tag>}
            {gameClass.role && <Tag>{gameClass.role}</Tag>}
            {gameClass.unlockCondition && <Tag variant="cyan">{gameClass.unlockCondition}</Tag>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {gameClass.description && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">职业介绍</h2>
              <p className="text-text">
                <GlossaryTooltip text={gameClass.description} />
              </p>
            </Card>
          )}

          {gameClass.passives && gameClass.passives.length > 0 && (
            <Card className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-text">被动技能</h2>
              <div className="space-y-3">
                {gameClass.passives.map((passive, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-border bg-surface-light p-3"
                  >
                    <div className="font-bold text-text">
                      {passive.name}
                      <span className="ml-2 text-sm text-text-muted">Lv.{passive.level}</span>
                    </div>
                    <p className="mt-1 text-sm text-text-muted">
                      <GlossaryTooltip text={passive.effect} />
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

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
                    <div className="font-bold text-text">{song!.name}</div>
                    <p className="mt-1 text-sm text-text-muted">
                      <GlossaryTooltip text={song!.effect} />
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {gameClass.buildNotes && (
            <Card>
              <h2 className="mb-4 text-xl font-bold text-text">养成建议</h2>
              <div className="markdown-content text-sm">{gameClass.buildNotes}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
