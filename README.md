# 遗忘之海 Wiki

《遗忘之海》（Sea of Remnants）玩家资料站，基于 React + Vite + TypeScript 构建。

## 快速开始

```bash
npm install
npm run predev
npm run dev
```

打开浏览器访问 `http://localhost:5173`。

## 内容维护

- 结构化数据放在 `content/data/`，使用 YAML 格式。
- 长文攻略放在 `content/markdown/`，使用 Markdown 格式。
- 每次修改内容后，运行 `npm run predev` 重新生成 `src/data/generated.json`。

## 目录索引

| 目录 | 说明 |
|---|---|
| [`content/`](content/README.md) | Wiki 内容源 |
| [`content/data/`](content/data/README.md) | YAML 数据文件 |
| [`content/markdown/`](content/markdown/README.md) | Markdown 攻略/说明 |
| [`content/schemas/`](content/schemas/README.md) | JSON Schema 校验 |
| [`scripts/`](scripts/README.md) | 构建与校验脚本 |
| [`src/`](src/README.md) | 前端源码 |
| [`docs/`](docs/README.md) | 项目文档 |

## 技术栈

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS 4
- react-router-dom 7
- Fuse.js（搜索）
- react-markdown（Markdown 渲染）
- YAML + Zod（内容数据）

## 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run test` | 运行测试 |
| `npm run lint` | 运行代码检查 |
| `npm run format` | 格式化代码 |
| `node scripts/validate-data.js` | 校验内容数据 |
| `node scripts/build-content.js` | 生成前端数据 |

## 部署

项目可部署到 GitHub Pages、Vercel 或 Netlify。构建输出目录为 `dist/`。

## 协作方式

- 玩家/贡献者提供游戏截图或文字数据。
- 维护者将数据分类写入对应 YAML/Markdown 文件。
- 前端自动渲染并支持全局搜索。
