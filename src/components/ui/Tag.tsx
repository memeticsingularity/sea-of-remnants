interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'cyan' | 'gold'
  className?: string
}

export function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const variantClasses = {
    default: 'bg-surface-light text-text-muted border-border',
    accent: 'bg-accent/10 text-accent border-accent/30',
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
    gold: 'bg-gold/10 text-gold border-gold/30',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
