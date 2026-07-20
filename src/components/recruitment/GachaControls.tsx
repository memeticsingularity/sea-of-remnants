interface GachaControlsProps {
  onPullOne: () => void
  onPullTen: () => void
  disabled?: boolean
  showTen?: boolean
}

export function GachaControls({ onPullOne, onPullTen, disabled, showTen = true }: GachaControlsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onPullOne}
        disabled={disabled}
        className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        招募 1 次
      </button>
      {showTen && (
        <button
          type="button"
          onClick={onPullTen}
          disabled={disabled}
          className="rounded-lg border border-accent bg-accent/10 px-6 py-3 font-medium text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          招募 10 次
        </button>
      )}
    </div>
  )
}
