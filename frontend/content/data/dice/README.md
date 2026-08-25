# 强化骰数据收录说明

本目录存放《遗忘之海》强化骰（游戏内类型显示为「辅助技」）的 YAML 数据。

## 字段约定

- `id`：英文唯一标识，前缀统一为 `dice-`
- `slug`：URL 友好标识，使用拼音
- `name`：中文显示名
- `type`：当前统一为 `辅助技`（游戏内显示）
- `level`：当前 YAML 中记录的最高等级数据
- `maxLevel`：游戏内等级上限，目前统一为 `10`
- `shortDesc`：简略描述
- `detailedDesc`：当前最高等级的详细描述
- `levelDetails`：各等级详细描述（可选，用于记录多个已知等级）
- `relatedGlossary`：相关术语
- `image`：图片路径（占位，资源待补充）
- `source`：获取方式
- `buildNotes`：搭配建议

## 收录进度

| 文件名 | 骰子名 | 当前记录最高等级 | 已收录等级 |
|---|---|---|---|
| butterfall.yaml | 蝶陨骰 | 1 | 1 |
| electric-surge.yaml | 电涌骰 | 3 | 1, 2, 3 |
| heavy-force.yaml | 重迫骰 | 2 | 1, 2 |
| meng-meng.yaml | 猛猛骰 | 3 | 3 |
| resonance.yaml | 共鸣骰 | 2 | 1, 2 |
| rock-solid.yaml | 磐石骰 | 1 | 1 |
| shatter.yaml | 碎碎骰 | 1 | 1 |
| shield-fist.yaml | 盾拳骰 | 3 | 2, 3 |
| swarm-butterfly.yaml | 群蝶骰 | 2 | 2 |
| thundercloud.yaml | 雷云骰 | 4 | 1, 3, 4 |

## 待补充

- 各骰子 5~10 级详细数值
- 缺失等级的中间数据（如电涌骰 4~10 级、盾拳骰 1 级等）
- `/public/images/dice/` 对应图片资源
