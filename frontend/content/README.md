# content/

Wiki 内容源目录，包含结构化 YAML 数据、Markdown 长文和 JSON Schema 校验定义。

## 子目录

- [`data/`](data/README.md) — YAML 数据文件
- [`markdown/`](markdown/README.md) — Markdown 攻略/说明
- [`schemas/`](schemas/README.md) — JSON Schema 定义

## 工作流

1. 编辑 `data/` 或 `markdown/` 中的文件。
2. 运行 `node scripts/validate-data.js` 校验。
3. 运行 `node scripts/build-content.js` 生成 `src/data/generated.json`。
4. 前端自动使用最新数据渲染。
