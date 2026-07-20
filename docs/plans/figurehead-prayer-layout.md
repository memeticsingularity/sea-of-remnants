# 船首像祈祷页面布局规范

## 路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/figurehead-prayer` | `FigureheadPrayerPage` | 守护图鉴主页面 |
| `/figurehead-prayer/recommend` | `FigureheadPrayerRecommendPage` | 三选一求助对比 |

## 页面布局

固定 24 列 CSS Grid，永不堆叠（无响应式断点回退）：

```
┌───────────────────────┬─────────────────────────────────────────────┐
│     左侧 col-span-8   │           右侧 col-span-16                  │
│                       │                                             │
│  ┌─ 选择分支 ───────┐ │  标签统计面板                                │
│  │ 联动/独立 开关   │ │  (当前已拥有标签汇总 + 档位/阈值)            │
│  │                   │ │                                             │
│  │ ▸ 战技特化  3/7  │ │  ┌─ 分支标签页 ────── (仅独立模式可见) ──┐ │
│  │ ▸ 潜能特化  1/7  │ │  │ 战技特化 | 潜能特化 | 船员培养          │ │
│  │ ▸ 船员培养  0/7  │ │  └─────────────────────────────────────────┘ │
│  └───────────────────┘ │                                             │
│                         │  图鉴网格                                   │
│  ┌─ 已配置 ─────────┐ │  [全部 | 已拥有 | 未拥有]  [稀有度]         │
│  │ 槽位1  未来可期  │ │  [只看可触发]  [搜索框]                      │
│  │ 槽位2  未来可期  │ │                                             │
│  │ 槽位3  一锤定音  │ │  ┌───┐ ┌───┐ ┌───┐ ┌───┐                   │
│  │ 槽位4  未来可期  │ │  │ C │ │ C │ │ C │ │ C │                   │
│  │ 槽位5  未来可期  │ │  └───┘ └───┘ └───┘ └───┘                   │
│  │ 槽位6  一锤定音  │ │                                             │
│  │ 槽位7  未来可期  │ │                                             │
│  └───────────────────┘ │                                             │
└───────────────────────┴─────────────────────────────────────────────┘
```

## 数据流

### 状态

```
loadoutCategory: GuardianCategory     — 左侧当前分支
galleryCategory: GuardianCategory      — 右侧当前分支
linked: boolean                         — 联动/独立
```

### 联动模式（linked = true，默认）

```
左侧点击分支 → setLoadoutCategory(category)
            → setGalleryCategory(category)   // 同步
```

右侧分支标签页隐藏，完全跟随左侧。

### 独立模式（linked = false）

```
左侧点击分支 → setLoadoutCategory(category)  // 仅左
右侧标签页  → 用户手动切换 galleryCategory    // 右独立
```

右侧底部出现独立的分支标签页，左右可分别显示不同分支。

### 切换回联动

从独立切换到联动时，自动将右侧 `galleryCategory` 同步为当前 `loadoutCategory`。

## 组件树

```
FigureheadPrayerPage
├── 顶部标题区
│   ├── Breadcrumb
│   ├── 已配置计数 (equippedCount / 21)
│   ├── Link → /figurehead-prayer/recommend
│   ├── 清空配置 按钮
│   └── 清空已拥有 按钮
│
├── 左侧 (col-span-8)
│   ├── 选择分支 Card
│   │   ├── 联动/独立按钮 (linked + onLinkedChange)
│   │   └── 分支按钮 × 3 (战技特化/潜能特化/船员培养)
│   └── LoadoutPanel
│       └── 7个槽位 (按固定套装顺序)
│
└── 右侧 (col-span-16)
    ├── ShipTagStatsPanel (标签统计)
    ├── GuardianCategoryTabs (仅独立模式可见)
    └── GuardianCollectionGrid
        ├── 筛选栏 (全部/已拥有/未拥有 + 只看可触发)
        ├── 稀有度过滤 (金/紫/蓝)
        ├── 搜索框
        └── GuardianCard 网格
```

## 已配置槽位套装顺序

每分支 7 个槽位，套装按以下固定模式循环：

| 槽位 | 套装 |
|------|------|
| 槽位 1 | 未来可期 |
| 槽位 2 | 未来可期 |
| 槽位 3 | 一锤定音 |
| 槽位 4 | 未来可期 |
| 槽位 5 | 未来可期 |
| 槽位 6 | 一锤定音 |
| 槽位 7 | 未来可期 |

即：**2 未来 + 1 一锤 + 2 未来 + 1 一锤 + 1 未来**

## 关键文件

| 文件 | 角色 |
|------|------|
| `src/pages/FigureheadPrayerPage.tsx` | 页面的状态管理与布局 |
| `src/pages/FigureheadPrayerRecommendPage.tsx` | 三选一求助页面 |
| `src/components/guardians/LoadoutPanel.tsx` | 已配置面板（7槽位 + 可搜索选择器） |
| `src/components/guardians/GuardianCollectionGrid.tsx` | 图鉴网格（筛选/搜索/卡片） |
| `src/components/guardians/GuardianCard.tsx` | 单张守护卡片 |
| `src/components/guardians/GuardianCategoryTabs.tsx` | 分支标签页（战技/潜能/培养） |
| `src/components/guardians/ShipTagStatsPanel.tsx` | 标签统计面板 |
| `src/hooks/useGuardianState.ts` | 守护状态管理（localStorage 持久化） |
