import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStats } from '@/hooks/useCollection'
import { Card } from '@/components/ui/Card'
import { SearchBox } from '@/components/search/SearchBox'

export function HomePage() {
  const { status, data: stats } = useStats()

  const quickLinks = useMemo(() => {
    if (!stats) return []
    return [
      { label: '船员', to: '/crews', count: stats.crews },
      { label: '技能', to: '/skills', count: stats.skills },
      { label: '行装', to: '/equipment', count: stats.equipment },
      { label: '船歌', to: '/songs', count: stats.songs },
      { label: '任务', to: '/quests', count: stats.quests },
      { label: '招募模拟器', to: '/recruitment', count: stats.recruitmentPools },
      { label: '术语表', to: '/glossary', count: stats.glossary },
    ]
  }, [stats])

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-text">遗忘之海 Wiki</h1>
        <p className="mb-6 text-text-muted">
          船员、技能、骰子、船歌、行装一站式资料查询
        </p>
        <div className="mx-auto max-w-xl">
          <SearchBox />
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-text">快速入口</h2>
      {status === 'loading' || !stats ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-border bg-surface p-4"
            >
              <div className="h-5 w-2/3 rounded bg-surface-light" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Card hover className="flex items-center justify-between">
                <span className="font-medium text-text">{link.label}</span>
                <span className="rounded-full bg-surface-light px-2 py-0.5 text-xs text-text-muted">
                  {link.count}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-text">最近更新</h2>
        <Card>
          <ul className="space-y-2 text-sm text-text-muted">
            <li>新增船员：海葬</li>
            <li>新增技能：虫群围猎</li>
            <li>新增行装：蝶蝶不休、契约胸针</li>
            <li>新增术语表与指南</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
