import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'sea-of-remnants:guardian-state'

export interface GuardianUserState {
  ownedIds: string[]
  focusTags: string[]
}

function loadState(): GuardianUserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ownedIds: [], focusTags: [] }
    const parsed = JSON.parse(raw)
    return {
      ownedIds: Array.isArray(parsed.ownedIds) ? parsed.ownedIds : [],
      focusTags: Array.isArray(parsed.focusTags) ? parsed.focusTags : [],
    }
  } catch {
    return { ownedIds: [], focusTags: [] }
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

  const actions = useMemo(
    () => ({ toggleOwned, toggleFocusTag, clearOwned }),
    [toggleOwned, toggleFocusTag, clearOwned],
  )

  return { state, ...actions }
}
