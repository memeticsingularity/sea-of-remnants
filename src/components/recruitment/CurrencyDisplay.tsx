interface CurrencyDisplayProps {
  currency: string
  singleCost: number
  tenCost: number
  roseStoneCost: number
  totalSpent: number
  isMemoryGroup?: boolean
}

export function CurrencyDisplay({
  currency,
  singleCost,
  tenCost,
  roseStoneCost,
  totalSpent,
  isMemoryGroup = false,
}: CurrencyDisplayProps) {
  if (isMemoryGroup) {
    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
        <span>
          每次重逢消耗：
          <span className="text-text">1 周机会</span>
        </span>
        <span>
          已累计过去：
          <span className="text-text">{totalSpent} 周</span>
        </span>
      </div>
    )
  }

  const totalRoseStone = totalSpent * roseStoneCost
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
      <span>
        单抽消耗：<span className="text-text">{singleCost} {currency}</span>
        <span className="ml-1 text-accent">/ {roseStoneCost.toLocaleString()} 蔷薇石</span>
      </span>
      <span>
        十连消耗：<span className="text-text">{tenCost} {currency}</span>
        <span className="ml-1 text-accent">/ {(tenCost * roseStoneCost).toLocaleString()} 蔷薇石</span>
      </span>
      <span>
        本次累计消耗：<span className="text-text">{totalSpent} {currency}</span>
        <span className="ml-1 text-accent">/ {totalRoseStone.toLocaleString()} 蔷薇石</span>
      </span>
    </div>
  )
}
