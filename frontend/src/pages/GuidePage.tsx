import { useParams, Link } from 'react-router-dom'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const page = wikiData.pages.find((p) => p.route === `/guides/${slug}`)

  if (!page) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text">未找到该指南</h2>
        <Link to="/" className="mt-4 inline-block text-accent-cyan hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumb
        items={[
          { label: '首页', to: '/' },
          { label: '指南', to: '/guides/crew-training' },
          { label: page.title },
        ]}
      />

      <Card>
        <article className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {page.content || ''}
          </ReactMarkdown>
        </article>
      </Card>
    </div>
  )
}
