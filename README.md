# 遗忘之海 Wiki（Sea of Remnants Wiki）

《遗忘之海》玩家 Wiki / 资料站，采用前后端分离的 monorepo 结构。

```
sea-of-remnants/
├── frontend/     # Vite + React + TypeScript 前端
├── backend/      # Spring Boot + Maven 后端（无数据库）
└── package.json  # 根脚本，协调前后端命令
```

## 环境要求

- Node.js 20+
- Java 21+
- Maven 3.9+

## 快速开始

```bash
# 1. 安装前端依赖
npm install

# 2. 同时启动前端（:5173）和后端（:8080）
npm run dev
```

## 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev:frontend` | 仅启动前端 |
| `npm run dev:backend` | 仅启动后端 |
| `npm run build` | 构建前后端 |
| `npm run validate` | 校验前端数据 |
| `npm run lint` | 前端代码检查 |

## 后端 API

启动后端后访问：

- `GET http://localhost:8080/api/crews`
- `GET http://localhost:8080/api/crews/{slug}`
- `GET http://localhost:8080/api/skills`
- `GET http://localhost:8080/api/skills/{slug}`
- `GET http://localhost:8080/api/classes`
- `GET http://localhost:8080/api/equipment`

更多集合见 `frontend/src/data/generated.json` 中的根字段。

## 数据管线

1. 内容数据写在 `frontend/content/data/*.yaml`。
2. 运行 `npm run validate` 校验数据。
3. 运行 `npm run build:frontend` 生成 `frontend/src/data/generated.json`。
4. 后端启动时从 `backend/src/main/resources/data/generated.json` 加载数据到内存。

> 当前阶段前后端数据文件需要手动同步；后续会改为根目录统一数据源。

## 目录约定

- `frontend/content/data/` — YAML 数据
- `frontend/content/markdown/` — Markdown 长文
- `frontend/src/` — 前端源码
- `backend/src/main/java/com/sor/` — 后端源码
- `backend/src/main/resources/data/` — 后端加载的数据文件

## 更多

详见 [`CLAUDE.md`](CLAUDE.md)。
