import { useMemo, useState } from 'react'
import { wikiData } from '@/data'
import { Card } from '@/components/ui/Card'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PoolSelector } from '@/components/recruitment/PoolSelector'
import { MemoryDepthSelector } from '@/components/recruitment/MemoryDepthSelector'
import { DeepMemoryTargetSelector } from '@/components/recruitment/DeepMemoryTargetSelector'
import { PityCounter } from '@/components/recruitment/PityCounter'
import { CurrencyDisplay } from '@/components/recruitment/CurrencyDisplay'
import { GachaControls } from '@/components/recruitment/GachaControls'
import { ResultGrid } from '@/components/recruitment/ResultCard'
import { HistoryPanel } from '@/components/recruitment/HistoryPanel'
import { StatsPanel } from '@/components/recruitment/StatsPanel'
import { MemoryReunionLogPanel } from '@/components/recruitment/MemoryReunionLogPanel'
import { useGachaState, useGachaHistory, type GachaResult } from '@/hooks/useGachaState'
import { useGachaEngine } from '@/hooks/useGachaEngine'
import type { RecruitmentPool } from '@/types'

const MEMORY_GROUP_ID = 'pool-memory-reunion'
const MEMORY_SLUGS = ['shallow-memory', 'middle-memory', 'deep-memory']
type MemoryDepth = 'shallow' | 'middle' | 'deep'

function isMemoryPool(pool: RecruitmentPool) {
  return MEMORY_SLUGS.includes(pool.slug)
}

function getDefaultCrewTarget(pool: RecruitmentPool): string {
  return pool.upItems.find((u) => u.crewIds?.length)?.crewIds?.[0] ?? ''
}

function getDefaultShadowTarget(pool: RecruitmentPool): string {
  return pool.upItems.find((u) => u.shadowIds?.length)?.shadowIds?.[0] ?? ''
}

export function RecruitmentSimulatorPage() {
  const pools = wikiData.recruitmentPools

  const memoryPools = useMemo(() => pools.filter(isMemoryPool), [pools])
  const otherPools = useMemo(() => pools.filter((p) => !isMemoryPool(p)), [pools])

  const displayPools = useMemo<RecruitmentPool[]>(() => {
    if (memoryPools.length === 0) return otherPools
    return [
      ...otherPools,
      {
        id: MEMORY_GROUP_ID,
        slug: 'memory-reunion',
        name: '记忆重逢',
        bannerName: '记忆重逢',
        type: 'weekly',
        currency: '免费',
        singleCost: 0,
        tenCost: 0,
        roseStoneCost: 0,
        tiers: [],
        upItems: [],
        pityRules: [],
      },
    ]
  }, [memoryPools, otherPools])

  const [activeGroupId, setActiveGroupId] = useState(displayPools[0]?.id ?? '')
  const isMemoryGroup = activeGroupId === MEMORY_GROUP_ID

  const [memoryDepth, setMemoryDepth] = useState<MemoryDepth>('deep')

  const baseMemoryPool = useMemo(
    () => memoryPools.find((p) => p.slug === `${memoryDepth}-memory`),
    [memoryPools, memoryDepth],
  )

  const deepPool = useMemo(
    () => memoryPools.find((p) => p.slug === 'deep-memory'),
    [memoryPools],
  )

  const [deepCrewTarget, setDeepCrewTarget] = useState(() =>
    deepPool ? getDefaultCrewTarget(deepPool) : '',
  )
  const [deepShadowTarget, setDeepShadowTarget] = useState(() =>
    deepPool ? getDefaultShadowTarget(deepPool) : '',
  )
  const [crewTargetAcquired, setCrewTargetAcquired] = useState(false)
  const [shadowTargetAcquired, setShadowTargetAcquired] = useState(false)

  const activePool = useMemo<RecruitmentPool | undefined>(() => {
    if (!isMemoryGroup) {
      return pools.find((p) => p.id === activeGroupId) ?? pools[0]
    }
    if (!baseMemoryPool) return pools[0]
    if (memoryDepth !== 'deep') return baseMemoryPool
    return {
      ...baseMemoryPool,
      upItems: [
        ...(deepCrewTarget && !crewTargetAcquired
          ? [{ crewIds: [deepCrewTarget], upRate: 0.5, guaranteeNextOnMiss: false }]
          : []),
        ...(deepShadowTarget && !shadowTargetAcquired
          ? [{ shadowIds: [deepShadowTarget], upRate: 0.5, guaranteeNextOnMiss: false }]
          : []),
      ],
    }
  }, [
    isMemoryGroup,
    activeGroupId,
    pools,
    baseMemoryPool,
    memoryDepth,
    deepCrewTarget,
    deepShadowTarget,
    crewTargetAcquired,
    shadowTargetAcquired,
  ])

  const { state, updateState, resetState } = useGachaState(activePool?.id ?? '')
  const { history, append, clear } = useGachaHistory()
  const engine = useGachaEngine(activePool)

  const [latestResults, setLatestResults] = useState<GachaResult[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const resetTargetAcquired = () => {
    setCrewTargetAcquired(false)
    setShadowTargetAcquired(false)
  }

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
    const result = results[0]
    if (result?.isUp) {
      if (result.type === 'crew') setCrewTargetAcquired(true)
      if (result.type === 'shadow') setShadowTargetAcquired(true)
    }
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
        pools={displayPools}
        activePoolId={isMemoryGroup ? MEMORY_GROUP_ID : activePool.id}
        onSelect={(id) => {
          setActiveGroupId(id)
          setLatestResults([])
          resetTargetAcquired()
        }}
      />

      {isMemoryGroup && (
        <>
          <MemoryDepthSelector
            activeDepth={memoryDepth}
            onSelect={(depth) => {
              setMemoryDepth(depth)
              setLatestResults([])
              resetTargetAcquired()
            }}
          />
          {memoryDepth === 'deep' && deepPool && (
            <DeepMemoryTargetSelector
              pool={deepPool}
              crewTargetId={deepCrewTarget}
              shadowTargetId={deepShadowTarget}
              onChangeGroup={(crewId, shadowId) => {
                setDeepCrewTarget(crewId)
                setDeepShadowTarget(shadowId)
                resetTargetAcquired()
              }}
            />
          )}
        </>
      )}

      {isPlaceholder ? (
        <Card>
          <h2 className="text-xl font-bold text-text">{activePool.name}</h2>
          <p className="mt-2 text-text-muted">该招募池规则待补充，暂不支持模拟。</p>
        </Card>
      ) : (
        <>
          <PityCounter state={state} pool={activePool} />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CurrencyDisplay
              currency={activePool.currency}
              singleCost={activePool.singleCost}
              tenCost={activePool.tenCost}
              roseStoneCost={activePool.roseStoneCost}
              totalSpent={state.totalSpent}
              isMemoryGroup={isMemoryGroup}
            />
            <div className="flex gap-3">
              <GachaControls
                onPullOne={handlePullOne}
                onPullTen={handlePullTen}
                disabled={isAnimating}
                showTen={!isMemoryGroup}
              />
              <button
                type="button"
                onClick={() => {
                  resetState()
                  resetTargetAcquired()
                }}
                className="rounded-lg border border-border px-4 py-3 text-sm text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                重置保底
              </button>
            </div>
          </div>

          {latestResults.length > 0 && <ResultGrid results={latestResults} />}

          <StatsPanel history={history} pools={pools} activePoolId={activePool.id} />

          <HistoryPanel history={history} onClear={clear} />
        </>
      )}

      {isMemoryGroup && <MemoryReunionLogPanel pools={memoryPools} />}
    </div>
  )
}
