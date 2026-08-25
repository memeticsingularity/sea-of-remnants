import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useSearchQuery, useSearchShortcut } from '@/hooks/useSearch'

/**
 * 全局搜索框组件
 *
 * 支持键盘导航（上下箭头选择、回车跳转、ESC 关闭）
 * 支持快捷键 `/` 聚焦（通过 useSearchShortcut）
 */
export function SearchBox() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  // 当前选中结果的索引，用于键盘导航
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  // 基于 query 从 Fuse.js 索引中获取搜索结果
  const results = useSearchQuery(query)

  useSearchShortcut(inputRef)

  // 当搜索词变化时，重置选中索引到第一项
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      // 回车跳转到选中结果的路由
      navigate(results[selectedIndex].route)
      setQuery('')
      setIsOpen(false)
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="搜索船员、技能、行装、术语..."
          className="w-full rounded-md border border-border bg-surface-light py-2 pl-9 pr-4 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
        />
      </div>
      {isOpen && query.trim() && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-md border border-border bg-surface shadow-lg">
          {results.map((result, index) => (
            <li
              key={result.id}
              className={`cursor-pointer px-4 py-2 text-sm ${
                index === selectedIndex
                  ? 'bg-surface-light text-accent'
                  : 'text-text hover:bg-surface-light'
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseDown={() => {
                navigate(result.route)
                setQuery('')
                setIsOpen(false)
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{result.title}</span>
                <span className="text-xs text-text-dim">{result.type}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
