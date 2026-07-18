# scripts/

构建与校验脚本目录。

## 文件

- `build-content.js` — 读取 `content/data/` 和 `content/markdown/`，生成 `src/data/generated.json`
- `validate-data.js` — 校验 YAML 数据完整性、引用正确性、图片路径等

## 使用

```bash
# 校验数据
node scripts/validate-data.js

# 生成前端数据
node scripts/build-content.js

# 或者在 npm 脚本中
npm run predev   # 运行 build-content.js
npm run prebuild # 运行 validate + build
```
