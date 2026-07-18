import { useMemo } from 'react'
import type { GachaResult } from './useGachaState'

export interface GachaStats {
  totalPulls: number
  blackCount: number
  purpleCount: number
  blueCount: number
  upCount: number
  blackRate: number
  purpleRate: number
  blueRate: number
  upRate: number
  averageBlackPity: number
  averagePurplePity: number
}

export function useGachaStats(history: GachaResult[]) {
  return useMemo<GachaStats>(() => {
    const totalPulls = history.length
    const blackCount = history.filter((r) => r.rarity === 'black').length
    const purpleCount = history.filter((r) => r.rarity === 'purple').length
    const blueCount = history.filter((r) => r.rarity === 'blue').length
    const upCount = history.filter((r) => r.isUp).length

    return {
      totalPulls,
      blackCount,
      purpleCount,
      blueCount,
      upCount,
      blackRate: totalPulls > 0 ? blackCount / totalPulls : 0,
      purpleRate: totalPulls > 0 ? purpleCount / totalPulls : 0,
      blueRate: totalPulls > 0 ? blueCount / totalPulls : 0,
      upRate: totalPulls > 0 ? upCount / totalPulls : 0,
      averageBlackPity: blackCount > 0 ? totalPulls / blackCount : 0,
      averagePurplePity: purpleCount > 0 ? totalPulls / purpleCount : 0,
    }
  }, [history])
}
