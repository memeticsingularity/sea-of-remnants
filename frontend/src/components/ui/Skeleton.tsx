/**
 * 加载骨架屏：列表/详情页在数据未就绪时展示的占位块。
 */
export function Skeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-1/3 rounded bg-surface-light" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg border border-border bg-surface p-4">
            <div className="mb-3 h-4 w-2/3 rounded bg-surface-light" />
            <div className="h-3 w-1/2 rounded bg-surface-light" />
          </div>
        ))}
      </div>
    </div>
  )
}
