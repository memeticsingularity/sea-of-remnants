# content/schemas/

JSON Schema 定义目录，用于构建时校验 YAML 数据。

## 文件

- `crew.schema.json`
- `ship.schema.json`
- `skill.schema.json`
- `dice.schema.json`
- `song.schema.json`
- `equipment.schema.json`
- `item.schema.json`
- `quest.schema.json`
- `location.schema.json`
- `glossary.schema.json`

## 说明

当前 Phase 1 主要使用 Zod 在 `scripts/validate-data.js` 中校验。JSON Schema 文件将在 Phase 2 逐步补充完整，用于更严格的数据校验和编辑器自动补全。
