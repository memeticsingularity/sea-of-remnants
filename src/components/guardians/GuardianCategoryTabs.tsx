type GuardianCategory = '战技特化' | '潜能特化' | '船员培养'

interface GuardianCategoryTabsProps {
  active: GuardianCategory
  onSelect: (category: GuardianCategory) => void
  counts: Record<GuardianCategory, number>
}

const CATEGORIES: GuardianCategory[] = ['战技特化', '潜能特化', '船员培养']

export function GuardianCategoryTabs({ active, onSelect, counts }: GuardianCategoryTabsProps) {
  return (
    <div className="flex border-b border-border">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            active === category
              ? 'text-accent'
              : 'text-text-muted hover:text-text'
          }`}
        >
          {category}
          <span className="ml-1.5 text-xs text-text-dim">{counts[category] ?? 0}</span>
          {active === category && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-accent" />
          )}
        </button>
      ))}
    </div>
  )
}
