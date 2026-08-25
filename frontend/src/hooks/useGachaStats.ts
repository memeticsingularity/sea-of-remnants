import { useMemo } from 'react'
import type { GachaResult } from './useGachaState'

export interface GachaStats {
  totalPulls: number
  blackCount: number
  purpleCount: number
  blueCount: number
  upCount: number
  upBlackCount: number
  upPurpleCount: number
  blackRate: number
  purpleRate: number
  blueRate: number
  upRate: number
  upBlackRate: number
  upPurpleRate: number
  averageBlackPity: number
  averagePurplePity: number
}

export function useGachaStats(history: GachaResult[], poolId: string = 'all') {
  return useMemo<GachaStats>(() => {
    const filtered = poolId === 'all' ? history : history.filter((r) => r.poolId === poolId)
    const totalPulls = filtered.length
    const blackCount = filtered.filter((r) => r.rarity === 'black').length
    const purpleCount = filtered.filter((r) => r.rarity === 'purple').length
    const blueCount = filtered.filter((r) => r.rarity === 'blue').length
    const upCount = filtered.filter((r) => r.isUp).length
    const upBlackCount = filtered.filter((r) => r.isUp && r.rarity === 'black').length
    const upPurpleCount = filtered.filter((r) => r.isUp && r.rarity === 'purple').length

    return {
      totalPulls,
      blackCount,
      purpleCount,
      blueCount,
      upCount,
      upBlackCount,
      upPurpleCount,
      blackRate: totalPulls > 0 ? blackCount / totalPulls : 0,
      purpleRate: totalPulls > 0 ? purpleCount / totalPulls : 0,
      blueRate: totalPulls > 0 ? blueCount / totalPulls : 0,
      upRate: totalPulls > 0 ? upCount / totalPulls : 0,
      upBlackRate: totalPulls > 0 ? upBlackCount / totalPulls : 0,
      upPurpleRate: totalPulls > 0 ? upPurpleCount / totalPulls : 0,
      averageBlackPity: blackCount > 0 ? totalPulls / blackCount : 0,
      averagePurplePity: purpleCount > 0 ? totalPulls / purpleCount : 0,
    }
  }, [history, poolId])
}
