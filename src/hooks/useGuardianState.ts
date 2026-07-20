import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Guardian } from '@/types'

const STORAGE_KEY = 'sea-of-remnants:guardian-state'

export type GuardianCategory = Guardian['category']

export const GUARDIAN_CATEGORIES: GuardianCategory[] = [
  '战技特化',
  '潜能特化',
  '船员培养',
]

export function getDefaultLoadouts(): Record<GuardianCategory, (string | null)[]> {
  return {
    战技特化: Array(7).fill(null),
    潜能特化: Array(7).fill(null),
    船员培养: Array(7).fill(null),
  }
}

/**
 * 所有分支的 7 个槽位都按同一套装顺序：
 * 未来可期 ×2、一锤定音 ×1、未来可期 ×2、一锤定音 ×1、未来可期 ×1
 */
export function getSlotSet(index: number): '未来可期' | '一锤定音' {
  const pattern: ('未来可期' | '一锤定音')[] = [
    '未来可期',
    '未来可期',
    '一锤定音',
    '未来可期',
    '未来可期',
    '一锤定音',
    '未来可期',
  ]
  return pattern[index]
}

export interface GuardianUserState {
  ownedIds: string[]
  focusTags: string[]
  loadouts: Record<GuardianCategory, (string | null)[]>
}

function loadState(): GuardianUserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ownedIds: [], focusTags: [], loadouts: getDefaultLoadouts() }
    const parsed = JSON.parse(raw)
    const loadedLoadouts = parsed.loadouts || {}
    return {
      ownedIds: Array.isArray(parsed.ownedIds) ? parsed.ownedIds : [],
      focusTags: Array.isArray(parsed.focusTags) ? parsed.focusTags : [],
      loadouts: GUARDIAN_CATEGORIES.reduce((acc, category) => {
        const branch = Array.isArray(loadedLoadouts[category])
          ? loadedLoadouts[category]
          : []
        acc[category] = Array(7)
          .fill(null)
          .map((_, i) => branch[i] ?? null)
        return acc
      }, getDefaultLoadouts()),
    }
  } catch {
    return { ownedIds: [], focusTags: [], loadouts: getDefaultLoadouts() }
  }
}

function saveState(state: GuardianUserState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function useGuardianState() {
  const [state, setState] = useState<GuardianUserState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const toggleOwned = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      ownedIds: prev.ownedIds.includes(id)
        ? prev.ownedIds.filter((x) => x !== id)
        : [...prev.ownedIds, id],
    }))
  }, [])

  const toggleFocusTag = useCallback((tagName: string) => {
    setState((prev) => ({
      ...prev,
      focusTags: prev.focusTags.includes(tagName)
        ? prev.focusTags.filter((x) => x !== tagName)
        : [...prev.focusTags, tagName],
    }))
  }, [])

  const clearOwned = useCallback(() => {
    setState((prev) => ({ ...prev, ownedIds: [] }))
  }, [])

  const equipGuardian = useCallback(
    (category: GuardianCategory, slotIndex: number, id: string | null) => {
      setState((prev) => {
        const next: GuardianUserState = {
          ...prev,
          loadouts: {
            战技特化: [...prev.loadouts['战技特化']],
            潜能特化: [...prev.loadouts['潜能特化']],
            船员培养: [...prev.loadouts['船员培养']],
          },
        }
        if (id) {
          for (const cat of GUARDIAN_CATEGORIES) {
            next.loadouts[cat] = next.loadouts[cat].map((slotId) =>
              slotId === id ? null : slotId,
            )
          }
        }
        next.loadouts[category][slotIndex] = id
        return next
      })
    },
    [],
  )

  const unequipGuardian = useCallback(
    (category: GuardianCategory, slotIndex: number) => {
      equipGuardian(category, slotIndex, null)
    },
    [equipGuardian],
  )

  const clearLoadouts = useCallback(() => {
    setState((prev) => ({ ...prev, loadouts: getDefaultLoadouts() }))
  }, [])

  const actions = useMemo(
    () => ({
      toggleOwned,
      toggleFocusTag,
      clearOwned,
      equipGuardian,
      unequipGuardian,
      clearLoadouts,
    }),
    [
      toggleOwned,
      toggleFocusTag,
      clearOwned,
      equipGuardian,
      unequipGuardian,
      clearLoadouts,
    ],
  )

  return { state, ...actions }
}
