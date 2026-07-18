import { Card } from '@/components/ui/Card'

interface RulesPanelProps {
  rules?: string
  poolName: string
}

export function RulesPanel({ rules, poolName }: RulesPanelProps) {
  if (!rules) {
    return (
      <Card>
        <p className="text-text-muted">{poolName} 的详细规则待补充。</p>
      </Card>
    )
  }

  return (
    <Card className="markdown-content">
      <h3 className="mb-4 text-lg font-bold text-text">{poolName} 招募规则</h3>
      <div className="whitespace-pre-line text-sm leading-relaxed text-text-muted">{rules}</div>
    </Card>
  )
}
