# CLAUDE.md — 遗忘之海 Wiki

本文件用于指导 AI（Claude）参与本项目时的行为与约定。

## 项目目标

为《遗忘之海》（Sea of Remnants）搭建一个可长期维护的玩家 Wiki/资料站，覆盖船员、船只、职业、技能、骰子、船歌、行装、物品、任务、地点等全部游戏系统。

## 技术栈与版本

- **前端**：React 19 + Vite 8 + TypeScript 6
- **后端**：Spring Boot 3.4 + Maven + Java 21（无数据库）
- **样式**：Tailwind CSS 4（基于 CSS 的 `@theme` 配置）
- **路由**：react-router-dom 7
- **搜索**：Fuse.js（客户端搜索）
- **Markdown**：react-markdown + remark-gfm
- **数据**：YAML + 构建后生成的 JSON

## Monorepo 结构

```
sea-of-remnants/          ← 根项目
├── frontend/             ← Vite/React 前端
│   ├── content/data/     ← YAML 数据
│   ├── content/markdown/ ← Markdown 长文
│   ├── scripts/          ← 数据校验与构建脚本
│   ├── src/              ← 前端源码
│   └── package.json
├── backend/              ← Spring Boot 后端
│   ├── src/main/java/    ← Java 源码
│   ├── src/main/resources/data/ ← 后端加载的数据 JSON
│   └── pom.xml
├── package.json          ← 根 scripts，协调前后端
├── README.md
└── CLAUDE.md
```

## 内容管线

内容文件位于 `frontend/content/`：

```
frontend/content/data/        YAML 数据
frontend/content/markdown/    Markdown 长文
frontend/scripts/build-content.js    → frontend/src/data/generated.json
frontend/scripts/validate-data.js    → 数据校验
```

每次修改 `frontend/content/` 后，运行：

```bash
npm run validate
npm run build:frontend
```

后端启动时会从 `backend/src/main/resources/data/generated.json` 加载数据到内存。当前阶段前后端数据文件需要手动同步，后续会统一为根目录共享数据源。

## 目录约定

### 内容数据 `frontend/content/data/`

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

### Markdown `frontend/content/markdown/`

- `guides/` — 系统指南（培养、行装、骰子等）
- `events/` — 活动说明
- `articles/` — 攻略长文
- `pages/` — 静态页面

### 前端源码 `frontend/src/`

- `components/layout/` — 布局组件（AppShell、SidebarNav、TopBar）
- `components/ui/` — 基础 UI（Card、Tag、StatBlock、Breadcrumb）
- `components/search/` — 搜索相关
- `components/glossary/` — 术语提示
- `components/cards/` — 列表卡片
- `components/skills/` — 技能交互组件
- `pages/` — 页面组件
- `hooks/` — 自定义 Hooks
- `types/` — TypeScript 类型
- `routes/` — 路由配置
- `styles/` — 全局样式

### 后端源码 `backend/src/main/java/com/sor/`

- `SorApplication.java` — 启动类
- `controller/` — REST API 控制器
- `service/` — 业务逻辑 / 内存数据服务
- `model/` — 数据模型（需要时扩展）
- `config/` — 配置类

## 新增内容类型流程

1. 在 `frontend/src/types/index.ts` 中定义接口。
2. 在 `frontend/content/data/` 下创建新目录。
3. 在 `frontend/content/schemas/` 中添加 JSON Schema（可选但推荐）。
4. 更新 `frontend/scripts/build-content.js` 中的 `COLLECTIONS` 数组。
5. 在 `frontend/scripts/validate-data.js` 中添加该校验逻辑。
6. 在 `frontend/src/routes/router.tsx` 中添加路由。
7. 在 `frontend/src/pages/` 中创建列表/详情页（或复用 `CategoryPage`）。
8. 在 `frontend/src/components/cards/` 中添加卡片组件（可选）。
9. 更新 `frontend/src/components/layout/SidebarNav.tsx` 导航。
10. 如果后端需要暴露该集合，在 `WikiController` 中会自动通过 `/api/{collection}` 暴露，无需额外修改。

## 新增单个实体的流程

1. 判断实体类型（crew/ship/skill/equipment 等）。
2. 按对应字段约定填写 YAML。
3. 如含复杂机制或养成建议，使用 `buildNotes` 字段或写入 Markdown。
4. 运行校验和构建脚本。
5. 同步 `frontend/src/data/generated.json` 到 `backend/src/main/resources/data/generated.json`。
6. 启动 `npm run dev` 查看效果。

## UI 风格

- 暗色主题，背景 `#0a0a0f`，卡片背景 `#13131f`。
- Accent：霓虹紫 `#d946ef`，青色 `#06b6d4`。
- 卡片式布局、圆角、轻微边框。
- 术语使用下划线虚线高亮，hover 显示解释。

## 编码约定

- 文件名使用 PascalCase（组件）或 kebab-case（页面/工具）。
- 组件使用函数组件 + TypeScript 类型。
- 优先使用 Tailwind 工具类，复杂样式写入 `frontend/src/styles/index.css`。
- 路径别名使用 `@/` 指向 `frontend/src/`。
- 后端 Java 代码使用标准 Spring Boot 分层结构。

## 测试与部署检查清单

- [ ] `npm run validate` 通过
- [ ] `npm run build:frontend` 成功生成
- [ ] `npm run build:backend` 成功
- [ ] `npm run dev` 前后端均正常启动
- [ ] 首页、列表页、详情页、搜索、术语提示均正常
- [ ] `/api/crews`、`/api/skills` 等接口返回数据
- [ ] 新增目录已创建 README.md
- [ ] `CLAUDE.md` 和 `docs/` 已同步更新
