import type { ReactNode } from 'react'
import { Card } from './Card'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <p className="text-text-muted">{title}</p>
      {description && <p className="mt-1 text-sm text-text-dim">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  )
}
