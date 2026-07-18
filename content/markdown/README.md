# content/markdown/

Markdown 长文目录，用于系统指南、活动说明、攻略文章等。

## 子目录

- `guides/` — 系统指南（培养、行装、骰子等）
- `events/` — 活动说明
- `articles/` — 攻略长文
- `pages/` — 静态页面

## 注册页面

Markdown 文件需要在 `content/data/index.yaml` 中注册才能生成路由：

```yaml
pages:
  - id: guide-crew-training
    title: 船员培养指南
    route: /guides/crew-training
    markdown: markdown/guides/crew-training.md
```

## 写作规范

- 一级标题作为页面标题。
- 术语使用 `[术语名]` 格式。
- 图片放在 `public/images/` 下，使用绝对路径引用。
