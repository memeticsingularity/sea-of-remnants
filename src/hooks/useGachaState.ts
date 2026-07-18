import { useCallback, useEffect, useState } from 'react'

export interface GachaState {
  poolId: string
  blackPity: number
  purplePity: number
  blackUpGuarantee: boolean
  purpleUpGuarantee: boolean
  firstBlackPulled: boolean
  totalSpent: number
}

const STORAGE_KEY = 'sea-of-remnants:gacha-state'

function getDefaultState(poolId: string): GachaState {
  return {
    poolId,
    blackPity: 0,
    purplePity: 0,
    blackUpGuarantee: false,
    purpleUpGuarantee: false,
    firstBlackPulled: false,
    totalSpent: 0,
  }
}

function loadState(): Record<string, GachaState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveState(states: Record<string, GachaState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch {
    // ignore
  }
}

export function useGachaState(poolId: string) {
  const [states, setStates] = useState<Record<string, GachaState>>(() => loadState())

  const state = states[poolId] ?? getDefaultState(poolId)

  useEffect(() => {
    setStates((prev) => {
      if (prev[poolId]) return prev
      return { ...prev, [poolId]: getDefaultState(poolId) }
    })
  }, [poolId])

  useEffect(() => {
    saveState(states)
  }, [states])

  const updateState = useCallback(
    (updater: (prev: GachaState) => GachaState) => {
      setStates((prev) => ({
        ...prev,
        [poolId]: updater(prev[poolId] ?? getDefaultState(poolId)),
      }))
    },
    [poolId],
  )

  const resetState = useCallback(() => {
    setStates((prev) => ({
      ...prev,
      [poolId]: getDefaultState(poolId),
    }))
  }, [poolId])

  return { state, updateState, resetState }
}

export function useGachaHistory() {
  const [history, setHistory] = useState<GachaResult[]>(() => {
    try {
      const raw = localStorage.getItem('sea-of-remnants:gacha-history')
      if (!raw) return []
      return JSON.parse(raw)
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('sea-of-remnants:gacha-history', JSON.stringify(history))
    } catch {
      // ignore
    }
  }, [history])

  const append = useCallback((results: GachaResult[]) => {
    setHistory((prev) => [...results, ...prev].slice(0, 500))
  }, [])

  const clear = useCallback(() => setHistory([]), [])

  return { history, append, clear }
}

export interface GachaResult {
  id: string
  type: 'crew' | 'shadow'
  name: string
  rarity: 'black' | 'purple' | 'blue'
  isUp: boolean
  poolId: string
  poolName: string
  timestamp: number
  pullIndex: number
}
