import { formatStatName } from '@/utils/format'

interface StatBlockProps {
  stats?: Record<string, number | string | undefined>
  className?: string
}

export function StatBlock({ stats, className = '' }: StatBlockProps) {
  if (!stats || Object.keys(stats).length === 0) return null

  return (
    <dl className={`grid grid-cols-2 gap-x-4 gap-y-2 text-sm ${className}`}>
      {Object.entries(stats).map(([key, value]) => {
        const isNegative =
          typeof value === 'number' ? value < 0 : String(value).startsWith('-')
        return (
          <div key={key} className="flex justify-between">
            <dt className="text-text-muted">{formatStatName(key)}</dt>
            <dd className={isNegative ? 'text-negative' : 'text-text'}>
              {formatStatValue(value)}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function formatStatValue(value: number | string | undefined): string {
  if (value === undefined) return '-'
  if (typeof value === 'number') {
    return value > 0 ? `+${value}` : String(value)
  }
  return String(value)
}
