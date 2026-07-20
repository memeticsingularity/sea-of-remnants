import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'sea-of-remnants:party-config'

export const MAIN_ATTRIBUTES = [
  '力量',
  '体质',
  '敏捷',
  '智力',
  '魅力',
  '感知',
] as const

export type MainAttribute = (typeof MAIN_ATTRIBUTES)[number]

export interface PartySlot {
  mainAttr: MainAttribute | ''
}

export interface PartyConfig {
  slots: PartySlot[]
}

function getDefaultConfig(): PartyConfig {
  return {
    slots: Array.from({ length: 4 }, () => ({ mainAttr: '' })),
  }
}

function loadConfig(): PartyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultConfig()
    const parsed = JSON.parse(raw)
    return {
      slots: Array.from({ length: 4 }, (_, i) => ({
        mainAttr: MAIN_ATTRIBUTES.includes(parsed.slots?.[i]?.mainAttr)
          ? (parsed.slots[i].mainAttr as MainAttribute)
          : '',
      })),
    }
  } catch {
    return getDefaultConfig()
  }
}

function saveConfig(config: PartyConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // ignore
  }
}

export function usePartyConfig() {
  const [config, setConfig] = useState<PartyConfig>(() => loadConfig())

  useEffect(() => {
    saveConfig(config)
  }, [config])

  const setMainAttr = useCallback((index: number, mainAttr: MainAttribute | '') => {
    setConfig((prev) => {
      const slots = prev.slots.map((s, i) =>
        i === index ? { ...s, mainAttr } : s,
      )
      return { ...prev, slots }
    })
  }, [])

  const clearSlot = useCallback((index: number) => {
    setConfig((prev) => {
      const slots: PartySlot[] = prev.slots.map((s, i) =>
        i === index ? { ...s, mainAttr: '' } : s,
      )
      return { ...prev, slots }
    })
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(getDefaultConfig())
  }, [])

  return {
    config,
    setMainAttr,
    clearSlot,
    resetConfig,
  }
}
