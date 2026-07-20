import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { wikiData } from '@/data'
import {
  useMemoryReunionLog,
  type MemoryReunionLogEntry,
} from '@/hooks/useMemoryReunionLog'
import type { RecruitmentPool } from '@/types'

type Depth = 'shallow' | 'middle' | 'deep'
type Rarity = 'black' | 'purple'
type ObjectType = 'crew' | 'shadow'

const depthOptions: { key: Depth; label: string }[] = [
  { key: 'shallow', label: '浅层记忆' },
  { key: 'middle', label: '中层记忆' },
  { key: 'deep', label: '深层记忆' },
]

const rarityOptions: { key: Rarity; label: string }[] = [
  { key: 'black', label: '黑券' },
  { key: 'purple', label: '紫券' },
]

const typeOptions: { key: ObjectType; label: string }[] = [
  { key: 'crew', label: '船员' },
  { key: 'shadow', label: '往日之影' },
]

const rarityText: Record<Rarity, string> = {
  black: 'text-gold',
  purple: 'text-purple',
}

function usePoolObjects(pool: RecruitmentPool | undefined, rarity: Rarity, type: ObjectType) {
  return useMemo(() => {
    if (!pool) return []
    const tier = pool.tiers.find((t) => t.key === rarity)
    if (!tier) return []
    const ids = type === 'crew' ? tier.pool.crewIds : tier.pool.shadowIds
    return ids.map((id) => {
      if (type === 'crew') {
        const crew = wikiData.crews.find((c) => c.id === id)
        return { id, name: crew?.name ?? id }
      }
      const shadow = wikiData.shadows.find((s) => s.id === id)
      return { id, name: shadow?.name ?? id }
    })
  }, [pool, rarity, type])
}

export function MemoryReunionLogPanel({
  pools,
}: {
  pools: RecruitmentPool[]
}) {
  const { entries, add, remove, clear } = useMemoryReunionLog()
  const sortedEntries = useSortedEntries(entries)

  const [depth, setDepth] = useState<Depth>('deep')
  const [rarity, setRarity] = useState<Rarity>('black')
  const [objectType, setObjectType] = useState<ObjectType>('crew')
  const [objectId, setObjectId] = useState('')

  const pool = useMemo(
    () => pools.find((p) => p.slug === `${depth}-memory`),
    [pools, depth],
  )

  const objects = usePoolObjects(pool, rarity, objectType)

  // 根据深度约束稀有度：浅层只有紫券
  const availableRarities =
    depth === 'shallow' ? rarityOptions.filter((r) => r.key === 'purple') : rarityOptions

  // 当深度变化导致当前券级不可用时，自动修正为第一个可用券级
  useEffect(() => {
    if (availableRarities.length > 0 && !availableRarities.some((r) => r.key === rarity)) {
      setRarity(availableRarities[0].key)
    }
  }, [availableRarities, rarity])

  // 当对象列表变化且当前选择无效时，自动选第一个
  useEffect(() => {
    if (objects.length > 0 && !objects.some((o) => o.id === objectId)) {
      setObjectId(objects[0].id)
    }
  }, [objects, objectId])

  const handleAdd = () => {
    if (!pool || !objectId) return
    const object = objects.find((o) => o.id === objectId)
    if (!object) return
    add({
      depth,
      depthLabel: depthOptions.find((d) => d.key === depth)?.label ?? depth,
      rarity,
      type: objectType,
      objectId,
      objectName: object.name,
    })
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 font-bold text-text">记录真实记忆重逢结果</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-text-muted">记忆深度</label>
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value as Depth)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              {depthOptions.map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">券级</label>
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value as Rarity)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              {availableRarities.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">类型</label>
            <select
              value={objectType}
              onChange={(e) => setObjectType(e.target.value as ObjectType)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              {typeOptions.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">对象</label>
            <select
              value={objectId}
              onChange={(e) => setObjectId(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              {objects.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!objectId}
          className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          添加记录
        </button>
      </Card>

      <Card className="max-h-[60vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-text">记忆重逢记录</h3>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-xs text-text-muted hover:text-negative"
            >
              清空
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-text-muted">暂无记忆重逢记录。</p>
        ) : (
          <>
            <MemoryReunionStats entries={entries} />
            <div className="mt-4 space-y-3">
              {sortedEntries.map(({ entry, weekNumber }) => (
                <MemoryReunionLogItem
                  key={entry.id}
                  entry={entry}
                  weekNumber={weekNumber}
                  onDelete={() => remove(entry.id)}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

function useSortedEntries(entries: MemoryReunionLogEntry[]) {
  return useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
    return sorted.map((entry, index) => ({ entry, weekNumber: index + 1 }))
  }, [entries])
}

function MemoryReunionStats({ entries }: { entries: MemoryReunionLogEntry[] }) {
  const stats = useMemo(() => {
    const totalWeeks = entries.length
    const blackCount = entries.filter((e) => e.rarity === 'black').length
    const purpleCount = entries.filter((e) => e.rarity === 'purple').length
    const crewCount = entries.filter((e) => e.type === 'crew').length
    const shadowCount = entries.filter((e) => e.type === 'shadow').length
    return { totalWeeks, blackCount, purpleCount, crewCount, shadowCount }
  }, [entries])

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <StatTile label="已过去周数" value={`${stats.totalWeeks} 周`} />
      <StatTile label="黑券" value={stats.blackCount} highlight="gold" />
      <StatTile label="紫券" value={stats.purpleCount} highlight="purple" />
      <StatTile label="船员" value={stats.crewCount} />
      <StatTile label="往日之影" value={stats.shadowCount} />
    </div>
  )
}

function StatTile({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: 'gold' | 'purple'
}) {
  const valueClass =
    highlight === 'gold'
      ? 'text-gold'
      : highlight === 'purple'
        ? 'text-purple'
        : 'text-text'

  return (
    <div className="rounded-lg border border-border bg-surface p-3 text-center">
      <div className={`text-xl font-bold ${valueClass}`}>{value}</div>
      <div className="mt-1 text-xs text-text-muted">{label}</div>
    </div>
  )
}

function MemoryReunionLogItem({
  entry,
  weekNumber,
  onDelete,
  formatTime,
}: {
  entry: MemoryReunionLogEntry
  weekNumber: number
  onDelete: () => void
  formatTime: (timestamp: number) => string
}) {
  const rarityLabel = rarityOptions.find((r) => r.key === entry.rarity)?.label ?? entry.rarity
  const typeLabel = typeOptions.find((t) => t.key === entry.type)?.label ?? entry.type

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span className="rounded-full bg-surface-light px-2 py-0.5 text-xs">第 {weekNumber} 周</span>
          <span>{entry.depthLabel} · {formatTime(entry.timestamp)}</span>
        </div>
        <div className="text-base font-medium text-text">
          本次重逢的记忆为
          <span className={`mx-1 font-bold ${rarityText[entry.rarity]}`}>
            {rarityLabel}·{entry.objectName}
          </span
          >
          <span className="text-xs text-text-muted">（{typeLabel}）</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-text-muted hover:text-negative"
      >
        删除
      </button>
    </div>
  )
}
