# public/

静态资源目录。

## 子目录

- `images/` — 图片资源
  - `crews/` — 船员头像
  - `ships/` — 船只图片
  - `skills/` — 技能图标
  - `dice/` — 骰子图标
  - `songs/` — 船歌图标
  - `equipment/` — 行装图片
  - `items/` — 物品图片
  - `locations/` — 地点图片
  - `guides/` — 指南配图

## 引用方式

在 Markdown 或组件中，使用根路径引用：

```markdown
![描述](/images/equipment/example.png)
```

```tsx
<img src="/images/crews/example.png" />
```
