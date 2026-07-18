# 架构设计

## 整体架构

```
┌─────────────────────────────────────┐
│           前端 Wiki (React SPA)        │
│  页面 / 组件 / 搜索 / 术语提示 / 路由   │
└──────────────┬──────────────────────┘
│ src/data/generated.json
┌──────────────▼──────────────────────┐
│         内容管线 (Node.js)            │
│  YAML/Markdown → 校验 → 合并 → JSON   │
└──────────────┬──────────────────────┘
│ content/data/ + content/markdown/
┌──────────────▼──────────────────────┐
│         内容源                        │
│  YAML 数据文件 + Markdown 攻略        │
└─────────────────────────────────────┘
```

## 技术选型理由

- **React + Vite**：现代前端标准栈，开发体验好，构建快。
- **Tailwind CSS 4**：基于 CSS 的主题配置，暗色主题易于维护。
- **react-router-dom**：声明式路由，支持动态段。
- **Fuse.js**：零后端依赖的客户端模糊搜索，适合中小型数据集。
- **YAML + Markdown**：非程序员也能编辑，分离数据与展示。
- **Zod + JSON Schema**：双重校验确保数据质量。

## 数据流

1. 贡献者编辑 `content/data/*.yaml` 或 `content/markdown/*.md`。
2. `scripts/validate-data.js` 校验数据完整性。
3. `scripts/build-content.js` 读取、合并、生成 `src/data/generated.json`。
4. 前端通过 `src/data/index.ts` 导入 generated.json。
5. 页面组件渲染列表、详情、搜索、术语提示。
