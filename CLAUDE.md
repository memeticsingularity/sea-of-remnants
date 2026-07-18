# CLAUDE.md — 遗忘之海 Wiki

本文件用于指导 AI（Claude）参与本项目时的行为与约定。

## 项目目标

为《遗忘之海》（Sea of Remnants）搭建一个可长期维护的玩家 Wiki/资料站，覆盖船员、船只、职业、技能、骰子、船歌、行装、物品、任务、地点等全部游戏系统。

## 技术栈与版本

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS 4（基于 CSS 的 `@theme` 配置）
- react-router-dom 7
- Fuse.js（客户端搜索）
- react-markdown + remark-gfm（Markdown 渲染）
- YAML + Zod（内容数据与校验）

## 内容管线

```
content/data/        YAML 数据
content/markdown/    Markdown 长文
scripts/build-content.js    → src/data/generated.json
scripts/validate-data.js    → 数据校验
```

每次修改 `content/` 后，运行：

```bash
node scripts/validate-data.js
node scripts/build-content.js
```

## 目录约定

### 内容数据 `content/data/`

每个实体一个 YAML 文件，按类型分目录：

- `crews/` — 船员
- `ships/` — 船只
- `classes/` — 职业
- `skills/` — 职业技能
- `dice/` — 骰子/辅助技
- `songs/` — 船歌
- `equipment/` — 行装（含特殊行装）
- `items/` — 物品/材料
- `quests/` — 任务
- `locations/` — 地点/海域
- `glossary/` — 术语解释

### Markdown `content/markdown/`

- `guides/` — 系统指南（培养、行装、骰子等）
- `events/` — 活动说明
- `articles/` — 攻略长文
- `pages/` — 静态页面

### 前端源码 `src/`

- `components/layout/` — 布局组件（AppShell、SidebarNav、TopBar）
- `components/ui/` — 基础 UI（Card、Tag、StatBlock、Breadcrumb）
- `components/search/` — 搜索相关
- `components/glossary/` — 术语提示
- `components/cards/` — 列表卡片
- `pages/` — 页面组件
- `hooks/` — 自定义 Hooks
- `types/` — TypeScript 类型
- `routes/` — 路由配置
- `styles/` — 全局样式

## 新增内容类型流程

1. 在 `src/types/index.ts` 中定义接口。
2. 在 `content/data/` 下创建新目录。
3. 在 `content/schemas/` 中添加 JSON Schema（可选但推荐）。
4. 更新 `scripts/build-content.js` 中的 `COLLECTIONS` 数组。
5. 在 `scripts/validate-data.js` 中添加该校验逻辑。
6. 在 `src/routes/router.tsx` 中添加路由。
7. 在 `src/pages/` 中创建列表/详情页（或复用 `CategoryPage`）。
8. 在 `src/components/cards/` 中添加卡片组件（可选）。
9. 更新 `src/components/layout/SidebarNav.tsx` 导航。

## 新增单个实体的流程

1. 判断实体类型（crew/ship/skill/equipment 等）。
2. 按对应字段约定填写 YAML。
3. 如含复杂机制或养成建议，使用 `buildNotes` 字段或写入 Markdown。
4. 运行校验和构建脚本。
5. 启动 `npm run dev` 查看效果。

## UI 风格

- 暗色主题，背景 `#0a0a0f`，卡片背景 `#13131f`。
- Accent：霓虹紫 `#d946ef`，青色 `#06b6d4`。
- 卡片式布局、圆角、轻微边框。
- 术语使用下划线虚线高亮，hover 显示解释。

## 编码约定

- 文件名使用 PascalCase（组件）或 kebab-case（页面/工具）。
- 组件使用函数组件 + TypeScript 类型。
- 优先使用 Tailwind 工具类，复杂样式写入 `src/styles/index.css`。
- 路径别名使用 `@/` 指向 `src/`。

## 测试与部署检查清单

- [ ] `node scripts/validate-data.js` 通过
- [ ] `node scripts/build-content.js` 成功生成
- [ ] `npm run build` 成功
- [ ] 首页、列表页、详情页、搜索、术语提示均正常
- [ ] 新增目录已创建 README.md
- [ ] `CLAUDE.md` 和 `docs/` 已同步更新

## 用户偏好

- 用户会根据实际游玩内容逐步补充数据（截图、文字、数值）。
- AI 负责分类、建模、写入 YAML/Markdown。
- 内容源同时服务前端 Wiki 展示和 AI 回答养成问题。
- 每个实体 YAML 中预留 `buildNotes` / `recommendations` 字段记录养成建议。
