import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 ${
        hover ? 'transition-colors hover:border-accent/50 hover:bg-surface-light' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
