import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'sea-of-remnants:party-crew-config'

export interface PartySlot {
  crewId: string
}

export interface PartyConfig {
  slots: PartySlot[]
}

function getDefaultConfig(): PartyConfig {
  return {
    slots: Array.from({ length: 4 }, () => ({ crewId: '' })),
  }
}

function loadConfig(): PartyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultConfig()
    const parsed = JSON.parse(raw)
    return {
      slots: Array.from({ length: 4 }, (_, i) => ({
        crewId:
          typeof parsed.slots?.[i]?.crewId === 'string'
            ? parsed.slots[i].crewId
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

  const setCrew = useCallback((index: number, crewId: string) => {
    setConfig((prev) => {
      const slots = prev.slots.map((s, i) =>
        i === index ? { ...s, crewId } : s,
      )
      return { ...prev, slots }
    })
  }, [])

  const clearSlot = useCallback((index: number) => {
    setConfig((prev) => {
      const slots = prev.slots.map((s, i) =>
        i === index ? { ...s, crewId: '' } : s,
      )
      return { ...prev, slots }
    })
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(getDefaultConfig())
  }, [])

  return {
    config,
    setCrew,
    clearSlot,
    resetConfig,
  }
}
