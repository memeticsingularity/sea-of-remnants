import { Card } from './Card'

interface ErrorStateProps {
  error?: Error
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="text-center">
      <p className="text-text">{error?.message ?? '加载失败'}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-accent/50 bg-surface-light px-4 py-1.5 text-sm text-accent transition-colors hover:border-accent"
        >
          重试
        </button>
      )}
    </Card>
  )
}
