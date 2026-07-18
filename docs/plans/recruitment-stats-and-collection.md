# Plan: 招募统计按池子拆分 + UP 黑紫分离 + 招募图鉴

## Context

当前招募模拟器的「出货统计」只支持全池汇总，无法按单个招募池查看；UP 黑券与 UP 紫券混在一起；也没有地方查看自己抽到过哪些船员/往日之影、各抽到过几个。

需求方希望：
1. 出货统计支持按池子筛选，默认当前选中池，同时可切「全部」。
2. 单独统计 UP 黑券、UP 紫券数量与占比。
3. 新增独立的「招募图鉴」页面，展示所有可抽取的船员和往日之影；未抽到显示锁定，抽到第 1 个解锁并显示角标计数 1，后续抽到累加 2、3…

## Approach

### 1. 出货统计改造

- 在 `src/hooks/useGachaStats.ts` 中：
  - 给 hook 增加可选 `poolId` 参数（默认 `'all'`）。
  - 在计算前先按 `poolId` 过滤 history。
  - 新增 `upBlackCount`、`upPurpleCount` 以及对应占比字段。
- 在 `src/components/recruitment/StatsPanel.tsx` 中：
  - 不再直接接收 `GachaStats`，而是接收 `history`、`pools`、`activePoolId`。
  - 组件内部维护 `selectedPoolId`，初始化为 `activePoolId`，并用 `useEffect` 跟随页面当前池变化。
  - 顶部加一个 `<select>` 池子筛选器，选项包含「全部招募池」+ 各个池。
  - 新增「UP 黑券」「UP 紫券」两个统计块。
- 在 `src/pages/RecruitmentSimulatorPage.tsx` 中：
  - 移除页面级的 `useGachaStats(history)`。
  - `<StatsPanel stats={stats} />` 改为 `<StatsPanel history={history} pools={pools} activePoolId={activePool.id} />`。

### 2. 招募图鉴页面

- 新建 hook `src/hooks/useCollectionStats.ts`：
  - 遍历 `wikiData.recruitmentPools`，聚合所有 `tiers[].pool.crewIds/shadowIds` 与 `upItems[].crewIds/shadowIds` 作为可抽取实体集合。
  - 根据实体所在 tier 的 `key` 确定其稀有度（黑/紫/蓝）。
  - 用 `history` 按 `id` 计数，得到每个实体的 `pulledCount`。
  - 从 `wikiData.crews` / `wikiData.shadows` 读取实体元数据。
  - 支持按 `poolId` 过滤（`'all'` 为全部）。
- 新建 `src/components/cards/ShadowCard.tsx`：
  - 参考 `CrewCard.tsx` 的卡片结构，展示影偶图片、名称、稀有度 tag、标签。
  - 支持传入 `pulledCount`，未抽到加锁定遮罩，抽到显示右上角计数徽章。
- 扩展 `src/components/cards/CrewCard.tsx`：
  - 增加可选 `pulledCount` prop；未抽到加锁定遮罩与灰度，抽到显示计数徽章；其余布局不变。
- 新建页面 `src/pages/CollectionPage.tsx`：
  - 顶部面包屑、标题、池子筛选下拉（默认「全部招募池」）。
  - 提供「全部 / 已拥有 / 未拥有」筛选切换。
  - 按稀有度/名称排序展示船员和影偶卡片网格。
- 路由与导航：
  - 在 `src/routes/router.tsx` 新增 `{ path: 'recruitment/collection', element: <CollectionPage /> }`。
  - 在 `src/components/layout/SidebarNav.tsx` 把「招募模拟器」改为带 children 的组「招募」，子项为「招募模拟器」（`/recruitment`）和「招募图鉴」（`/recruitment/collection`）。

### 3. 可复用组件/工具

- 复用现有 `Card`、`Tag`、`StatBlock`。
- `PoolSelector` 仅用于模拟器顶部的池子选择；统计和图鉴的池子筛选使用轻量下拉，避免过度复用。
- 复用 `useGachaHistory()` 获取 history，无需改数据结构。

## Critical files to modify

- `src/hooks/useGachaStats.ts`
- `src/components/recruitment/StatsPanel.tsx`
- `src/pages/RecruitmentSimulatorPage.tsx`
- `src/components/cards/CrewCard.tsx`
- `src/components/cards/ShadowCard.tsx` (new)
- `src/hooks/useCollectionStats.ts` (new)
- `src/pages/CollectionPage.tsx` (new)
- `src/routes/router.tsx`
- `src/components/layout/SidebarNav.tsx`

## Verification

1. 运行 `npm run build` 通过 TypeScript 与 Vite 构建。
2. 启动 `npm run dev`：
   - 在招募模拟器切换池子，出货统计默认跟随当前池。
   - 在统计面板切换到「全部招募池」，数字汇总所有池。
   - 确认「UP 黑券」「UP 紫券」分别显示。
   - 侧边栏「招募」组下点击「招募图鉴」进入新页面。
   - 图鉴中未抽到角色显示锁定；模拟器抽卡后返回图鉴，对应角色解锁并显示计数。
   - 图鉴的池子筛选与拥有状态筛选生效。
