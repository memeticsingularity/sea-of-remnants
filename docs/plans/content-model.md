# 内容模型设计

## 设计原则

- **一个实体一个文件**：便于增量补充和版本控制。
- **结构化数据用 YAML**：可查询、可筛选、可校验。
- **长文本/建议用 Markdown**：保留灵活性。
- **AI 与前端共用**：同一份数据既渲染页面，也用于回答养成问题。

## 通用字段

所有实体均应包含：

- `id`：英文唯一标识
- `slug`：URL 友好标识
- `name`：中文显示名
- `type` / `category`：子类型
- `image`：图片路径（可选）
- `source`：获取方式（可选）
- `buildNotes`：养成/搭配建议（Markdown 字符串，可选）

## 特殊类型字段

### 技能 Skill

- `shortDesc` / `detailedDesc`：简略与详细描述
- `level` / `maxLevel`：当前/最大等级
- `tags`：机制标签，如 `额外行动`
- `extraActions`：额外行动次数
- `diceSlots`：可配置骰子槽
- `relatedGlossary`：相关术语

### 骰子 Dice

- 同技能字段，但无 `diceSlots` 和 `extraActions`

### 行装 Equipment

- `slot`：炼金壶 / 头部 / 躯干 / 腿部 / 奇珍 / 特殊
- `rarity`：N / R / SR / SSR / UR
- `enhance`：当前强化等级
- `maxEnhanceByFruitLevel`：金果子等级限制
- `baseStats`：基础属性
- `requirements`：穿戴属性要求
- `enhanceRequirements`：每级强化要求
- `fixedAffixes`：固定词条
- `randomAffixes`：随机词条池
- `set` / `setBonus`：套装效果
- `flavor`：风味文本

### 术语 Glossary

- `term`：术语名
- `definition`：解释，支持 `[关联术语]` 链接
- `related`：关联术语列表

## 晶骸

晶骸是技能的一种特殊类型，统一归入 `content/data/skills/`，使用 `type: 晶骸` 区分。
