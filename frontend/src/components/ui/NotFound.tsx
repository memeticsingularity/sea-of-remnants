import { Link } from 'react-router-dom'

interface NotFoundProps {
  title?: string
  backTo?: string
  backLabel?: string
}

export function NotFound({
  title = '未找到内容',
  backTo,
  backLabel = '返回',
}: NotFoundProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-text">{title}</h2>
      {backTo && (
        <Link to={backTo} className="mt-4 inline-block text-accent-cyan hover:underline">
          {backLabel}
        </Link>
      )}
    </div>
  )
}
