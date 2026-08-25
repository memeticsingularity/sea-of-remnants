import type { Guardian, ShipTag } from '@/types'

export function getTagCounts(guardians: Guardian[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const g of guardians) {
    for (const t of g.tags) {
      if (!t.name || t.count <= 0) continue
      counts.set(t.name, (counts.get(t.name) || 0) + t.count)
    }
  }
  return counts
}

export function getTagSummary(
  ownedIds: string[],
  allGuardians: Guardian[],
  shipTags: ShipTag[],
): {
  name: string
  count: number
  activeLevel?: ShipTag['levels'][number]
  nextLevel?: ShipTag['levels'][number]
}[] {
  const owned = allGuardians.filter((g) => ownedIds.includes(g.id))
  const counts = getTagCounts(owned)

  const allTagNames = new Set<string>([
    ...shipTags.map((t) => t.name),
    ...Array.from(counts.keys()),
  ])

  return Array.from(allTagNames)
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .map((name) => {
      const count = counts.get(name) || 0
      const meta = shipTags.find((t) => t.name === name)
      const sortedLevels = meta?.levels.slice().sort((a, b) => a.count - b.count) ?? []
      const activeLevel = sortedLevels.slice().reverse().find((l) => count >= l.count)
      const nextLevel = sortedLevels.find((l) => count < l.count)
      return { name, count, activeLevel, nextLevel }
    })
}
