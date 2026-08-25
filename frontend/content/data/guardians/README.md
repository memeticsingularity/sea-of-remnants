# 守护

守护来自船员培养下的「船首像祈祷」玩法。每次会随机出现 3 个守护供玩家选择，选择后获得该守护并累加其提供的船只标签数量。

## 字段约定

```yaml
id: guardian-<slug>
slug: <slug>
name: 守护中文名
category: 战技特化 | 潜能特化 | 船员培养
rarity: 金 | 紫 | 蓝
set: 所属守护套装名（可选）
tags:
  - name: 重火力
    count: 3
effect: |
  守护效果描述。
relatedGlossary:
  - 术语名
buildNotes: |
  养成建议（可选）。
```

## 注意事项

- `category` 必须为三个分类之一。
- `rarity` 对应游戏内卡框颜色：金 / 紫 / 蓝。
- `tags` 里的 `name` 应对应 `content/data/ship-tags/` 中的标签名。
- 效果描述中的 `[术语]` 会自动链接到术语表。
