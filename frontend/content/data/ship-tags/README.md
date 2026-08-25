# 船只标签

船只标签是《遗忘之海》中影响船只build方向的养成属性。守护、部分装备或船只改造会提供标签数量，累积到特定阈值后激活额外效果。

## 字段约定

```yaml
id: ship-tag-<slug>
slug: <slug>
name: 标签中文名
description: |
  标签用途说明。
levels:
  - count: 3
    effect: 阈值效果描述
  - count: 6
    effect: 阈值效果描述
```

## 注意事项

- `levels` 按 `count` 升序排列。
- 效果描述中的 `[术语]` 会自动链接到术语表。
