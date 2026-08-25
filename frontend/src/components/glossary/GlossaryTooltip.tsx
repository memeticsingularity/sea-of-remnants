import { useState, useMemo } from 'react'
import { useCollection } from '@/hooks/useCollection'
import { MAIN_ATTRIBUTES } from '@/utils/partyMatch'
import type { GlossaryEntry } from '@/types'

interface GlossaryTooltipProps {
  /** 原始文本，其中 [术语名] 会被解析为高亮术语 */
  text: string
  className?: string
  /**
   * tooltip 弹出方向
   * - 'top': 在术语上方弹出（用于正文中的术语）
   * - 'bottom': 在术语下方弹出（用于 tooltip 内部的术语，形成链条）
   */
  placement?: 'top' | 'bottom'
  /** 队伍主属性，用于高亮效果中的属性系要求 */
  partyAttrs?: string[]
}

/**
 * 术语高亮组件
 *
 * 将文本中的 `[术语名]` 解析为可 hover 的术语链接，
 * 鼠标悬停时显示术语解释。支持递归解析术语定义中的术语，
 * 形成上下链条式的多层解释。
 */
export function GlossaryTooltip({
  text,
  className = '',
  placement = 'top',
  partyAttrs,
}: GlossaryTooltipProps) {
  const { data: glossary } = useCollection<GlossaryEntry>('glossary')
  const segments = useMemo(() => parseText(text), [text])

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'term') {
          // tooltip 内部的术语统一向下弹出，避免遮挡父 tooltip
          const termPlacement = placement === 'top' ? 'bottom' : 'bottom'
          return (
            <Term
              key={index}
              term={segment.content}
              placement={termPlacement}
              glossary={glossary ?? []}
            />
          )
        }
        return (
          <HighlightedText
            key={index}
            text={segment.content}
            partyAttrs={partyAttrs}
          />
        )
      })}
    </span>
  )
}

function HighlightedText({
  text,
  partyAttrs,
}: {
  text: string
  partyAttrs?: string[]
}) {
  if (!partyAttrs || partyAttrs.length === 0) {
    return <>{text}</>
  }

  const attrPatterns = MAIN_ATTRIBUTES.map((attr) => `${attr}系`).join('|')
  const regex = new RegExp(`(\\d个船员主属性互不相同)|(${attrPatterns})`, 'g')

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const matched = match[0]

    if (/^(\\d)个船员主属性互不相同$/.test(matched)) {
      const need = parseInt(matched[0], 10)
      const distinct = new Set(partyAttrs).size
      const active = distinct >= need
      parts.push(
        <span
          key={match.index}
          className={active ? 'text-positive' : 'text-text-dim'}
        >
          {matched}
        </span>,
      )
    } else {
      const attr = matched.replace('系', '')
      const active = partyAttrs.includes(attr)
      parts.push(
        <span
          key={match.index}
          className={active ? 'text-positive font-medium' : 'text-text-dim'}
        >
          {matched}
        </span>,
      )
    }

    lastIndex = match.index + matched.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

interface TermProps {
  term: string
  placement?: 'top' | 'bottom'
  glossary: GlossaryEntry[]
}

/**
 * 单个术语高亮元素
 *
 * 在 glossary 中查找对应术语，找到则显示 hover 提示，
 * 未找到则按普通文本渲染。
 */
function Term({ term, placement = 'top', glossary }: TermProps) {
  const [isOpen, setIsOpen] = useState(false)
  const entry = useMemo(
    () => glossary.find((g) => g.term === term),
    [glossary, term],
  )

  if (!entry) {
    return <span className="text-text">{term}</span>
  }

  // 根据弹出方向设置 tooltip 和桥接层样式
  const isTop = placement === 'top'
  const tooltipClass = isTop
    ? 'absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-md border border-border bg-surface-light p-3 text-sm text-text shadow-lg'
    : 'absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-md border border-border bg-surface-light p-3 text-sm text-text shadow-lg'
  const bridgeClass = isTop
    ? 'absolute bottom-full left-1/2 z-40 h-3 w-32 -translate-x-1/2'
    : 'absolute left-1/2 top-full z-40 h-3 w-32 -translate-x-1/2'

  return (
    <span
      className="relative inline-block cursor-help border-b border-dotted border-accent-cyan text-accent-cyan"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {term}
      {isOpen && (
        <>
          {/** 透明桥接层：覆盖术语与提示框之间的空隙，避免鼠标移动时提示框消失 */}
          <span className={bridgeClass} />
          <span className={tooltipClass}>
            <span className="mb-1 block font-bold text-accent-cyan">{entry.term}</span>
            {/**
             * 递归渲染术语定义。
             * 当前 tooltip 内部的术语继续向下弹出，形成解释链条。
             */}
            <GlossaryTooltip text={entry.definition} placement="bottom" />
          </span>
        </>
      )}
    </span>
  )
}

interface Segment {
  type: 'text' | 'term'
  content: string
}

/**
 * 解析文本，将 `[术语]` 拆分为术语片段和普通文本片段
 */
function parseText(text: string): Segment[] {
  const regex = /\[([^\]]+)\]/g
  const segments: Segment[] = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      })
    }
    segments.push({ type: 'term', content: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return segments
}
