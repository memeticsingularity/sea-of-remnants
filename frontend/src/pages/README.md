# src/pages/

页面组件目录，每个页面对应一个路由。

## 文件

- `HomePage.tsx` — 首页
- `CategoryPage.tsx` — 分类列表页（船员、技能、行装等）
- `CrewDetailPage.tsx` — 船员详情
- `SkillDetailPage.tsx` — 技能/骰子详情
- `EquipmentDetailPage.tsx` — 行装详情
- `GuidePage.tsx` — Markdown 指南页
- `GlossaryPage.tsx` — 术语表
- `NotFoundPage.tsx` — 404 页面

## 新增页面

1. 在 `src/routes/router.tsx` 中注册路由。
2. 创建对应页面组件。
3. 如需在导航中显示，更新 `src/components/layout/SidebarNav.tsx`。
