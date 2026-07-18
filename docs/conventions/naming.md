# 命名约定

## 文件命名

- YAML 数据文件：`kebab-case.yaml`
  - 例：`sea-burial.yaml`, `butterfly-endless.yaml`
- Markdown 文件：`kebab-case.md`
  - 例：`crew-training.md`, `equipment.md`
- 组件文件：`PascalCase.tsx`
  - 例：`CrewCard.tsx`, `SearchBox.tsx`
- 工具文件：`camelCase.ts`
  - 例：`useSearch.ts`, `format.ts`

## ID 命名

- 使用英文小写 + 连字符
- 格式：`{类型前缀}-{名称}`
  - 例：`crew-sea-burial`, `skill-swarm-hunt`, `equip-butterfly-endless`
- 类型前缀：
  - 船员：`crew-`
  - 船只：`ship-`
  - 职业：`class-`
  - 技能：`skill-`
  - 骰子：`dice-`
  - 船歌：`song-`
  - 行装：`equip-`
  - 物品：`item-`
  - 任务：`quest-`
  - 地点：`loc-`
  - 术语：`glossary-`

## Slug 命名

- 使用拼音或英文，便于 URL 阅读
- 中文名优先转拼音，多个词用连字符
  - 例：`hai-zang`, `die-die-bu-xiu`, `chong-qun-wei-lie`
- 避免使用特殊字符和空格

## 字段命名

- 使用 camelCase
- 布尔值前缀：`is`, `has`, `can`
- 数组使用复数形式：`skills`, `tags`, `fixedAffixes`
