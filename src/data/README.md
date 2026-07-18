# src/data/

生成的数据目录。

## 文件

- `generated.json` — 由 `scripts/build-content.js` 生成，包含所有 Wiki 数据
- `index.ts` — 导出 wikiData 和实体查询工具

## 注意

`generated.json` 是自动生成的，不要手动编辑。需要修改内容时，编辑 `content/` 下的源文件，然后重新运行构建脚本。
