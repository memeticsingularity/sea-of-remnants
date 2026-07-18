import { Link } from 'react-router-dom'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'

export function GlossaryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-text">术语表</h1>
      <div className="space-y-4">
        {wikiData.glossary.map((entry) => (
          <div key={entry.id} id={entry.id}>
            <Card>
              <h2 className="mb-2 text-xl font-bold text-accent-cyan">{entry.term}</h2>
              <p className="mb-3 text-text">
                <GlossaryTooltip text={entry.definition} />
              </p>
              {entry.related && entry.related.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-text-muted">相关：</span>
                  {entry.related.map((term) => {
                    const related = wikiData.glossary.find((g) => g.term === term)
                    return related ? (
                      <Link
                        key={term}
                        to={`/glossary#${related.id}`}
                        className="text-sm text-accent-cyan hover:underline"
                      >
                        {term}
                      </Link>
                    ) : (
                      <span key={term} className="text-sm text-text-muted">{term}</span>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
