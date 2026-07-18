# content/data/

YAML 数据文件目录。每个实体一个文件，按类型分子目录。

## 子目录

- `crews/` — 船员
- `ships/` — 船只
- `classes/` — 职业
- `skills/` — 职业技能（含晶骸）
- `dice/` — 骰子/辅助技
- `songs/` — 船歌
- `equipment/` — 行装（含特殊行装）
- `items/` — 物品/材料/礼物
- `quests/` — 任务
- `locations/` — 地点/海域
- `glossary/` — 术语解释
- `index.yaml` — 页面路由清单

## 新增实体

1. 选择对应类型的子目录。
2. 新建 YAML 文件，参考同目录已有示例。
3. 确保包含 `id`, `slug`, `name`。
4. 运行校验和构建脚本。

## 字段约定

详见 [`docs/plans/content-model.md`](../docs/plans/content-model.md)。
