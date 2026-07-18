import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="mb-4 text-6xl font-bold text-text-dim">404</h1>
      <h2 className="mb-6 text-2xl font-bold text-text">页面未找到</h2>
      <p className="mb-8 text-text-muted">该页面可能尚未创建或已被移除。</p>
      <Link
        to="/"
        className="rounded-md bg-accent px-6 py-2 text-white transition-colors hover:bg-accent-hover"
      >
        返回首页
      </Link>
    </div>
  )
}
