# 架构设计

## 整体架构

```
┌─────────────────────────────────────┐
│           前端 Wiki (React SPA)        │
│  页面 / 组件 / 搜索 / 术语提示 / 路由   │
│  请求 /sor/api/*                     │
└──────────────┬──────────────────────┘
               │ /sor/api/* (开发时代理到 8080)
┌──────────────▼──────────────────────┐
│         后端 (Spring Boot)            │
│  Controller → Service → Repository   │
│  /sor/api/* 统一返回 {code,data,msg} │
└──────────────┬──────────────────────┘
               │ 启动时读取 frontend/content/
┌──────────────▼──────────────────────┐
│         内容管线 (Node.js)            │
│  YAML/Markdown → 校验 → 合并 → JSON   │
└──────────────┬──────────────────────┘
               │ content/data/ + content/markdown/
┌──────────────▼──────────────────────┐
│         内容源                        │
│  YAML 数据文件 + Markdown 攻略        │
└─────────────────────────────────────┘
```

## 技术选型理由

- **React + Vite**：现代前端标准栈，开发体验好，构建快。
- **Tailwind CSS 4**：基于 CSS 的主题配置，暗色主题易于维护。
- **react-router-dom**：声明式路由，支持动态段。
- **Fuse.js**：零后端依赖的客户端模糊搜索，适合中小型数据集。
- **YAML + Markdown**：非程序员也能编辑，分离数据与展示。
- **Zod + JSON Schema**：双重校验确保数据质量。
- **Spring Boot 无数据库**：数据集小且只读，启动时全量加载 YAML/Markdown 到内存，简化部署。

## 数据流

1. 贡献者编辑 `frontend/content/data/*.yaml` 或 `frontend/content/markdown/*.md`。
2. `frontend/scripts/validate-data.js` 校验数据完整性。
3. `frontend/scripts/build-content.js` 读取、合并、生成 `frontend/src/data/generated.json`（前端使用）。
4. 后端启动时直接读取 `frontend/content/` 下的 YAML/Markdown，组装内存数据树，并复刻派生逻辑：
   - `pages.content`：把 `markdown` 文件内容注入页面记录。
   - `randomAffixes.occurrences`：根据装备引用反向索引随机词条出现位置。
   - `searchIndex`：构建全站搜索索引。
5. 前端通过 `/sor/api/*` 按需请求各领域接口：
   - `/sor/api/crews` / `/sor/api/crews/{slug}` / `/sor/api/crews/summary`
   - `/sor/api/skills` / `/sor/api/skills/{slug}` / `/sor/api/skills/{slug}/owners`
   - `/sor/api/dice` / `/sor/api/equipment` / `/sor/api/classes`
   - `/sor/api/{collection}` 与 `/{collection}/{slug}`（简单集合）
   - `/sor/api/search` / `/sor/api/stats` / `/sor/api/pages`

## 后端分层

```
com.sor
├── api
│   └── ApiResponse.java          # 统一响应包装 {code,data,message}
├── config
│   └── JacksonConfig.java        # ObjectMapper / YAMLMapper 全局配置
├── controller
│   ├── CrewController.java       # /crews、/crews/{slug}、/crews/summary
│   ├── SkillController.java      # /skills、/skills/{slug}、/skills/{slug}/owners
│   ├── DiceController.java       # /dice、/dice/{slug}
│   ├── EquipmentController.java  # /equipment、/equipment/{slug}
│   ├── GameClassController.java  # /classes、/classes/{slug}
│   ├── CommonEntityController.java # /{collection}、/{collection}/{slug}（白名单简单集合）
│   ├── SearchController.java     # /search
│   ├── StatsController.java      # /stats
│   └── PageController.java       # /pages、/pages/{id}
├── model
│   ├── BaseEntity.java           # id/slug/name/type + @JsonAnyGetter extra 透传
│   ├── Crew.java / Skill.java / Dice.java / Equipment.java / GameClass.java
│   ├── CrewSummary.java          # 列表/浮窗/选择器摘要 DTO
│   └── SearchIndexEntry.java / Page.java / SkillOwnersResult.java / ...
├── service
│   ├── WikiDataRepository.java        # 数据仓储：YAML 加载、内存 root、派生数据
│   ├── BaseEntityService.java         # 通用实体 Service 接口
│   ├── GenericEntityService.java      # 简单集合 Service 接口
│   ├── CrewService.java / SkillService.java / DiceService.java / EquipmentService.java / GameClassService.java
│   ├── SearchService.java / StatsService.java / PageService.java
│   └── service/impl                   # 上述接口实现
└── SorApplication.java
```

### 分层原则

- **Controller**：只负责 HTTP 路由、参数提取、统一响应包装。
- **Service**：业务逻辑与类型转换，核心领域使用强类型 POJO，简单集合使用 `BaseEntity` 透传。
- **Repository（WikiDataRepository）**：数据加载与派生逻辑的唯一真源，避免重复实现。
- **Model**：
  - 5 个核心实体（Crew/Skill/Dice/Equipment/GameClass）建立完整 POJO，字段与前端类型一一对应。
  - 12 个简单集合（ships/songs/items/quests/locations/glossary/symptoms/shadows/recruitment-pools/guardians/ship-tags/random-affixes）使用 `BaseEntity` + `Map<String,Object> extra`，通过 `@JsonAnyGetter/@JsonAnySetter` 平铺字段，保证前端反序列化无感知。

## 字段裁剪原则

- **列表/浮窗/选择器只拉摘要**：船员列表卡片、队伍配置浮窗等只需要少量字段，使用 `/sor/api/crews/summary`。
- **详情页才拉完整实体**：`CrewDetailPage` 使用 `/sor/api/crews/{slug}` 获取完整 `Crew`。
- **交叉引用按需渲染**：详情页中技能/船歌/行装关联只渲染名称与链接，数据量小，无需额外裁剪。

## API 前缀

所有后端接口统一挂载在 `/sor/api` 下，避免与同一域名下其他服务冲突。

- 前端 `API_BASE = import.meta.env.VITE_API_BASE ?? '/sor/api'`。
- 开发环境 `vite.config.ts` 代理 `/sor/api` → `http://localhost:8080`。
- 旧 `/api/*` 路径已废弃，返回 404。
