# 往日之影

本目录存放「往日之影」实体数据，每个影子一个 YAML 文件。

## 字段说明

- `id`：唯一标识，建议前缀 `shadow-`
- `slug`：URL 友好标识
- `name`：中文名
- `type`：固定为 `往日之影`
- `rarity`：招募券颜色等级，可选 `黑` / `紫` / `蓝`
- `description`：效果描述（可选）
- `tags`：标签数组（可选）
- `image`：图片路径（可选）
- `source`：获取来源（可选）

## 示例

```yaml
id: shadow-sleeping-doll
slug: sleeping-doll
name: 安眠人偶
type: 往日之影
rarity: 黑
description: 提升角色的生存能力。
image: /images/shadows/sleeping-doll.png
tags:
  - 黑券
  - 噼噜的旧日秘藏
```

## 注意事项

- 往日之影用于招募池配置中的 `pool.shadowIds` 引用。
- `rarity` 仅表示该影子在招募模拟器中对应的券颜色，不等同于装备/船员的四级品质。
