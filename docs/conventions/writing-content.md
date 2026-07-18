# YAML / Markdown 写作规范

## YAML 数据文件

### 基本格式

```yaml
id: crew-sea-burial
slug: hai-zang
name: 海葬
type: 船员
rarity: 紫
```

### 字段填写

- 必填字段必须填写（`id`, `slug`, `name`）。
- 可选字段如无需可省略，不要写 `null`。
- 字符串中包含特殊字符时用引号包裹。
- 多行文本使用 `|` 保留换行。

### 稀有度

游戏内品质分为四级：

- `绿` — 绿色品质
- `蓝` — 蓝色品质
- `紫` — 紫色品质
- `金` — 金色品质

行装、船歌、火炮等均使用此四级标准。

### 数值与百分比

- 数值直接写数字：
  ```yaml
  atk: 106
  def: -8
  ```
- 百分比建议写成字符串，避免 YAML 解析问题：
  ```yaml
  dotBoost: "7.2%"
  ```

### 行装强化数据

- 普通行装（手部 / 头部 / 躯干 / 腿部）支持 +1 到 +10 强化。
- 奇珍不强化。
- 使用 `statsByLevel` 记录各等级属性，key 为强化等级：
  ```yaml
  baseStats:
    atk: 77
    critRate: "5%"
  statsByLevel:
    6:
      atk: 77
      critRate: "5%"
    10:
      atk: 120
      critRate: "8%"
  ```
- 使用 `enhanceRequirements` 记录每级穿戴属性要求。

### 养成建议

使用 `buildNotes` 字段，支持 Markdown：

```yaml
buildNotes: |
  - 前期优先堆效果命中
  - 行装推荐：蝶蝶不休
```

## Markdown 指南

### 文件位置

- 系统指南：`content/markdown/guides/`
- 活动说明：`content/markdown/events/`
- 攻略长文：`content/markdown/articles/`

### 写作规范

- 使用一级标题作为文章标题。
- 使用二级/三级标题划分小节。
- 术语使用 `[术语名]` 格式，便于前端自动高亮。
- 表格用于展示数值对比。

### 图片引用

```markdown
![描述](/images/guides/example.png)
```

图片文件应放在 `public/images/` 下。
