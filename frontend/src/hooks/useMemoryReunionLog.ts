import { useCallback, useState } from 'react'

export interface MemoryReunionLogEntry {
  id: string
  depth: 'shallow' | 'middle' | 'deep'
  depthLabel: string
  rarity: 'black' | 'purple'
  type: 'crew' | 'shadow'
  objectId: string
  objectName: string
  timestamp: number
}

const STORAGE_KEY = 'sea-of-remnants:memory-reunion-log'

function loadEntries(): MemoryReunionLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveEntries(entries: MemoryReunionLogEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignore
  }
}

export function useMemoryReunionLog() {
  const [entries, setEntries] = useState<MemoryReunionLogEntry[]>(() => loadEntries())

  const add = useCallback((entry: Omit<MemoryReunionLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: MemoryReunionLogEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    }
    setEntries((prev) => {
      const next = [newEntry, ...prev].slice(0, 200)
      saveEntries(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      saveEntries(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setEntries([])
    saveEntries([])
  }, [])

  return { entries, add, remove, clear }
}
