import { useMemo, useState } from 'react'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PoolSelector } from '@/components/recruitment/PoolSelector'
import { PityCounter } from '@/components/recruitment/PityCounter'
import { CurrencyDisplay } from '@/components/recruitment/CurrencyDisplay'
import { GachaControls } from '@/components/recruitment/GachaControls'
import { ResultGrid } from '@/components/recruitment/ResultCard'
import { HistoryPanel } from '@/components/recruitment/HistoryPanel'
import { StatsPanel } from '@/components/recruitment/StatsPanel'
import { useGachaState, useGachaHistory, type GachaResult } from '@/hooks/useGachaState'
import { useGachaEngine } from '@/hooks/useGachaEngine'
import { useGachaStats } from '@/hooks/useGachaStats'

export function RecruitmentSimulatorPage() {
  const pools = wikiData.recruitmentPools
  const [activePoolId, setActivePoolId] = useState(pools[0]?.id ?? '')
  const activePool = useMemo(
    () => pools.find((p) => p.id === activePoolId) ?? pools[0],
    [pools, activePoolId],
  )

  const { state, updateState, resetState } = useGachaState(activePool?.id ?? '')
  const { history, append, clear } = useGachaHistory()
  const stats = useGachaStats(history)
  const engine = useGachaEngine(activePool)

  const [latestResults, setLatestResults] = useState<GachaResult[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  if (!activePool) {
    return (
      <div>
        <Breadcrumb items={[{ label: '首页', to: '/' }, { label: '招募模拟器' }]} />
        <Card>
          <p className="text-text-muted">暂无招募池数据。</p>
        </Card>
      </div>
    )
  }

  const handlePullOne = () => {
    if (!engine.canPull || isAnimating) return
    const { results, nextState } = engine.pullOne(state)
    updateState(() => nextState)
    append(results)
    setLatestResults(results)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), results.length * 80 + 300)
  }

  const handlePullTen = () => {
    if (!engine.canPull || isAnimating) return
    const { results, nextState } = engine.pullTen(state)
    updateState(() => nextState)
    append(results)
    setLatestResults(results)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), results.length * 80 + 300)
  }

  const isPlaceholder = activePool.tiers.length === 0

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: '首页', to: '/' }, { label: '招募模拟器' }]} />
      <h1 className="text-3xl font-bold text-text">招募模拟器</h1>

      <PoolSelector
        pools={pools}
        activePoolId={activePool.id}
        onSelect={(id) => {
          setActivePoolId(id)
          setLatestResults([])
        }}
      />

      {isPlaceholder ? (
        <Card>
          <h2 className="text-xl font-bold text-text">{activePool.name}</h2>
          <p className="mt-2 text-text-muted">
            {activePool.name === '记忆重逢'
              ? '每周免费招募，每次有 50% 概率获得黑券船员或往日之影。具体规则待补充，暂不支持模拟。'
              : '该招募池规则待补充，暂不支持模拟。'}
          </p>
        </Card>
      ) : (
        <>
          <PityCounter state={state} />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CurrencyDisplay
              currency={activePool.currency}
              singleCost={activePool.singleCost}
              tenCost={activePool.tenCost}
              totalSpent={state.totalSpent}
            />
            <div className="flex gap-3">
              <GachaControls
                onPullOne={handlePullOne}
                onPullTen={handlePullTen}
                disabled={isAnimating}
              />
              <button
                type="button"
                onClick={resetState}
                className="rounded-lg border border-border px-4 py-3 text-sm text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                重置保底
              </button>
            </div>
          </div>

          {latestResults.length > 0 && <ResultGrid results={latestResults} />}

          <StatsPanel stats={stats} />

          <HistoryPanel history={history} onClear={clear} />
        </>
      )}
    </div>
  )
}
