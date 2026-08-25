# 变更日志

## 2026-08-26

### 改造

- **后端领域分层与 API 前缀迁移**
  - API 前缀从 `/api` 统一迁移到 `/sor/api`，避免与其他服务冲突。
  - 拆分原 `WikiController` + `WikiDataService` 大泥球为领域分层：
    - `Controller`：Crew / Skill / Dice / Equipment / GameClass / CommonEntity / Search / Stats / Page。
    - `Service`：各领域 Service 接口 + `impl` 实现。
    - `Repository`：`WikiDataRepository` 作为 YAML 加载与派生数据真源。
  - 5 个核心实体（Crew/Skill/Dice/Equipment/GameClass）建立强类型 POJO，字段与前端类型对齐。
  - 12 个简单集合（ships/songs/items/quests/locations/glossary/symptoms/shadows/recruitment-pools/guardians/ship-tags/random-affixes）使用 `BaseEntity + @JsonAnyGetter` 透传字段。
  - 新增 `CrewSummary` 摘要 DTO 与 `/sor/api/crews/summary` 接口，供列表、浮窗、选择器使用。
  - 统一 Jackson 配置，注入 Spring `ObjectMapper`，关闭 `FAIL_ON_EMPTY_BEANS`，默认不序列化 null 字段。

### 修复

- **船员详情页不再误触发全量 crews 请求**
  - 根因：全局组件 `PartyConfigFloat` 在所有路由下无条件调用 `useCollection('crews')`。
  - 修复：`PartyConfigFloat` 改用 `/sor/api/crews/summary`，且折叠时不发起请求。
- **修复 `/crews/figurehead-prayer` 静态重定向被动态路由 `/crews/:slug` 吞掉的问题**
  - 将 `/crews/figurehead-prayer` 与 `/crews/figurehead-prayer/recommend` 两条静态重定向路由移到 `/crews/:slug` 之前。
- **修复 `/sor/api/search` 因部分词条 tags 为对象而导致的反序列化 500**
  - `WikiDataRepositoryImpl.addEntry` 现在对对象型 tag 提取 `name` 字段，只把文本加入搜索索引 tags。

### 工程

- `frontend/package.json` 新增 `validate` 脚本，与 `CLAUDE.md` 描述一致。
- 根目录 `package.json` 的 `dev:backend` / `build:backend` 改为使用 `bash backend/mvnw -f backend/pom.xml ...`，适配 Windows npm 脚本执行环境。

### 文档

- 更新 `docs/plans/architecture.md`：补充后端分层、数据流、`/sor/api` 前缀与字段裁剪原则。

## 2026-07-20

### 新增

- **船首像祈祷 / 守护系统**
  - 新增 40 个守护 YAML 数据（金/紫/蓝），覆盖三个分支：战技特化、潜能特化、船员培养。
  - 新增守护图鉴页面 `/figurehead-prayer`：分类标签页、已拥有/未拥有筛选、稀有度筛选、搜索。
  - 新增「三选一求助」页面 `/figurehead-prayer/recommend`：可任选 3 个守护对比效果与标签变化，便于截图咨询。
  - 新增「已配置」面板（加载配置）：每个分支 7 个槽位，按固定套装顺序（未来可期 / 一锤定音）约束，支持从对应分支的守护池中选择；选择器支持输入名称任意字检索，且已装备守护互斥（同一守护不能重复装备到多个槽位）。
  - 守护图鉴固定 24 列网格左右分栏：左侧 8 列为「已配置」(加载配置 + 分支选择 + 联动开关)，右侧 16 列为图鉴。布局永不堆叠，始终并列。
  - 联动/独立开关控制左右同步：联动时左侧切分支右侧图鉴同步跟随；关闭联动后左右可分别选择不同分支，方便对照配置。
  - 顶部计数改为「已配置守护 X / 21」，与游戏内 3×7 槽位对应。
  - 新增船只标签（ship-tags）数据与面板，根据已装备/已拥有守护统计标签数量、当前生效档位与下一档阈值。
  - 新增全局「当前队伍」悬浮配置：4 个船员槽位，从船员列表选择具体角色，自动读取主属性；本地持久化，用于判断守护/行装/技能等加成触发条件。
  - 三选一求助页与守护图鉴均根据当前队伍主属性自动显示每个守护是否可触发：效果文本中的属性系绿色高亮=队伍中有，灰色=缺少；卡片底部显示「✓ 可触发 / ✗ 无法触发」。
  - 守护图鉴新增「只看可触发」筛选按钮，一键只显示当前队伍能激活的守护。
  - 新增术语：协战、连续行动；更新负面状态定义为截图原文。
  - 侧边栏将「船首像祈祷」独立为一级菜单，原 `/crews/figurehead-prayer` 路由重定向到新 `/figurehead-prayer`。

- **记忆重逢系统**
  - 新增浅层、中层、深层记忆招募池 YAML 数据与规则指南 `/guides/memory-reunion`。
  - 招募模拟器合并「记忆重逢」入口，支持在浅/中/深三种记忆深度间切换。
  - 深层记忆支持成对选择目标（船员 + 往日之影一组）。
  - 模拟器正确实现记忆重逢保底：3 次内必出黑券船员/往日之影，9 次内必出黑券船员。
  - 模拟器正确实现目标概率规则：首次获得目标前目标占同池 50%，首次获得后概率恢复均等。
  - 记忆重逢模拟抽卡新增黑券金光、紫券紫光闪烁特效。
  - 新增「真实记忆重逢记录」面板，支持玩家手动记录实际抽卡结果，按周统计（已过去周数、黑券/紫券、船员/往日之影）。
  - 侧边栏「招募」菜单新增「记忆重逢」入口。

### 调整

- 招募模拟器消耗显示：记忆重逢下显示「周机会」与「已累计过去周数」。
- 记忆重逢仅支持单抽，隐藏十连按钮。

## 2026-07-19

### 新增

- **强化骰系统**
  - 新增 碎碎骰、蝶陨骰 数据，更新 电涌骰 等级详情。
  - 新增「蝶陨」术语解释。
  - 侧边栏增加强化骰入口，列表页支持按 辅助技 / 强化骰 筛选。
  - 强化骰拥有独立卡片 `DiceCard` 与详情页 `DiceDetailPage`，支持展示等级详情。
- **症状详情页**：支持症状严重程度、倾向、治疗等字段展示。
- **招募模拟器**：支持四种招募池、保底规则、UP 歪保底、抽取历史与统计。
- **招募图鉴**：展示船员/影子的获取来源与收集状态。
- **行装强化表**：详情页支持 +1~+10 强化属性切换与查看。
- **列表筛选**：船员、技能、强化骰、行装、物品、任务、地点、症状列表支持按类型筛选。

### 内容数据

- 行装新增：恐怖面具、孤芳面具、陈旧药瓶 等。
- 强化骰新增：碎碎骰、蝶陨骰；电涌骰补充等级详情。
- 症状新增：鹰晕症、虫晕症、创伤启蒙（正向）等示例。
- 地点/海域数据扩展。

### 修复

- 修复 SkillCard 对无 `tags` 数据的兼容问题。
- 统一状态/属性名称显示。
- 修复技能卡片 tooltip 与部分文案。

## 2026-07-18

### 新增

- 初始化遗忘之海 Wiki 项目
- 搭建 React + Vite + TypeScript 前端框架
- 配置 Tailwind CSS 4 暗色主题
- 建立 YAML/Markdown 内容管线
- 添加数据校验脚本
- 实现全局搜索与术语 hover 提示
- 完成船员、技能、行装详情页
- 建立 `docs/` 文档体系与 `CLAUDE.md`

### 示例数据

- 船员：海葬
- 技能：虫群围猎
- 骰子：电涌骰
- 船歌：喝彩，喝彩
- 行装：蝶蝶不休、契约胸针
- 术语：灵感、加料、强化骰、额外行动等

### 已知规模

根据玩家截图，游戏内包含：职业 69、行装 159、船歌 202、晶骸 86、骰子 23、特殊行装 13。
