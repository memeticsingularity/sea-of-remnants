interface SkillDetailToggleProps {
  showDetailed: boolean
  onToggle: () => void
}

export function SkillDetailToggle({ showDetailed, onToggle }: SkillDetailToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        showDetailed
          ? 'bg-accent text-white'
          : 'bg-surface-light text-text-muted hover:text-text'
      }`}
    >
      {showDetailed ? '简略' : '详细'}
    </button>
  )
}
