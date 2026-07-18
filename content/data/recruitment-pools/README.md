# 招募池

本目录存放招募/抽卡池配置，每个池子一个 YAML 文件。

## 字段说明

- `id`：唯一标识，建议前缀 `pool-`
- `slug`：URL 友好标识
- `name`：中文名
- `bannerName`：横幅/活动名
- `type`：池子类型，`limited`（活动限时）/ `standard`（常驻）/ `weekly`（每周免费）
- `currency`：消耗货币名称
- `singleCost`：单抽消耗
- `tenCost`：十连消耗
- `tiers`：稀有度档位配置
- `upItems`：UP 对象配置
- `pityRules`：保底规则

### tiers 档位

```yaml
tiers:
  - key: black          # 黑 / 紫 / 蓝
    label: 黑券
    baseRate: 0.008     # 基础概率
    comprehensiveRate: 0.0184  # 综合概率（展示用）
    hardPity: 80        # 硬保底抽数
    mixed: true         # 紫券是否船员与影子混合（织梦弦音）
    pool:
      crewIds: []
      shadowIds: []
```

### upItems UP 配置

```yaml
upItems:
  - crewIds:
      - crew-molly
    upRate: 0.5
    guaranteeNextOnMiss: true
```

### pityRules 保底规则

```yaml
pityRules:
  - type: hard_pity
    threshold: 80
    tier: black
    firstUpId: crew-molly        # 首次黑券强制命中
    guaranteeUpAfterMiss: true   # 歪后下次必 UP
  - type: purple_guarantee
    threshold: 10
    tier: purple
```

## 示例

参见 `zhimeng-xianyin.yaml`、`pilu-secret.yaml`、`never-leave.yaml`。

## 占位池

若某池子规则暂不全（如记忆重逢），可设置 `tiers: []` 和 `pityRules: []`，前端会显示占位提示。
