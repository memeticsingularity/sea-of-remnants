import { useState } from 'react'
import type { GachaResult } from '@/hooks/useGachaState'

interface ResultCardProps {
  result: GachaResult
  delay?: number
}

const rarityClasses: Record<GachaResult['rarity'], string> = {
  black: 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
  purple: 'border-purple bg-purple/10 shadow-[0_0_16px_rgba(139,92,246,0.2)]',
  blue: 'border-accent-cyan bg-accent-cyan/5',
}

const rarityLabels: Record<GachaResult['rarity'], string> = {
  black: '黑券',
  purple: '紫券',
  blue: '蓝券',
}

const rarityText: Record<GachaResult['rarity'], string> = {
  black: 'text-gold',
  purple: 'text-purple',
  blue: 'text-accent-cyan',
}

const flashClasses: Record<GachaResult['rarity'], string> = {
  black: 'animate-gold-flash',
  purple: 'animate-purple-flash',
  blue: '',
}

export function ResultCard({ result, delay = 0 }: ResultCardProps) {
  const [revealed, setRevealed] = useState(delay === 0)

  if (!revealed) {
    setTimeout(() => setRevealed(true), delay)
  }

  return (
    <div
      className={`relative flex flex-col items-center rounded-lg border p-3 text-center transition-all duration-300 ${
        revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      } ${rarityClasses[result.rarity]} ${revealed ? flashClasses[result.rarity] : ''}`}
    >
      {result.isUp && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-xs text-white">
          UP
        </span>
      )}
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-md bg-surface-light text-2xl">
        {result.type === 'crew' ? '👤' : '🃏'}
      </div>
      <p className="text-sm font-medium text-text">{result.name}</p>
      <p className={`mt-0.5 text-xs ${rarityText[result.rarity]}`}>
        {rarityLabels[result.rarity]} · {result.type === 'crew' ? '船员' : '往日之影'}
      </p>
    </div>
  )
}

interface ResultGridProps {
  results: GachaResult[]
}

export function ResultGrid({ results }: ResultGridProps) {
  if (results.length === 0) return null
  return (
    <div className="grid grid-cols-5 gap-3">
      {results.map((result, index) => (
        <ResultCard key={`${result.timestamp}-${index}`} result={result} delay={index * 80} />
      ))}
    </div>
  )
}
