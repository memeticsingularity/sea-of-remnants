import { SearchBox } from '@/components/search/SearchBox'

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <div className="text-sm text-text-muted">
        遗忘之海玩家资料站
      </div>
      <div className="w-96">
        <SearchBox />
      </div>
    </header>
  )
}
