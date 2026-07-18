interface CurrencyDisplayProps {
  currency: string
  singleCost: number
  tenCost: number
  totalSpent: number
}

export function CurrencyDisplay({
  currency,
  singleCost,
  tenCost,
  totalSpent,
}: CurrencyDisplayProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
      <span>
        单抽消耗：<span className="text-text">{singleCost} {currency}</span>
      </span>
      <span>
        十连消耗：<span className="text-text">{tenCost} {currency}</span>
      </span>
      <span>
        本次累计消耗：<span className="text-accent">{totalSpent} {currency}</span>
      </span>
    </div>
  )
}
