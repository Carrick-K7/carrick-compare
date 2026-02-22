# Compare v1.0.0 - Tech Spec

> **状态**: ✅ 已完成
> **版本**: v1.0.0
> **更新时间**: 2026-02-22

---

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  HomePage   │  │ ResultPage  │  │  UI Components  │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  SearchBox  │  │ GDPTrendChart│  │ SimilarRegions │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  gdp-annual │  │  gdp-half   │  │    regions      │  │
│  │   .json     │  │   .json     │  │    .json        │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 架构特点
- **纯前端应用**: 无后端服务，数据以静态 JSON 形式打包
- **客户端渲染**: React SPA，React Router 处理路由
- **静态部署**: 构建产物可直接部署到任何静态托管服务

---

## 2. 技术选型及理由

| 技术 | 用途 | 选型理由 |
|:---|:---|:---|
| **React 19** | UI 框架 | 最新版本，性能优化，并发特性 |
| **TypeScript** | 类型系统 | 类型安全，IDE 支持好，维护性强 |
| **Vite** | 构建工具 | 快速 HMR，优化构建输出 |
| **Tailwind CSS 4** | 样式方案 | 原子化 CSS，开发效率高 |
| **Recharts** | 图表库 | React 友好，配置灵活，轻量 |
| **React Router v7** | 路由管理 | 声明式路由，支持动态参数 |
| **Radix UI** | 基础组件 | 无障碍支持好，可定制性强 |
| **Playwright** | E2E 测试 | 现代浏览器自动化测试 |

---

## 3. 数据结构

### 3.1 核心类型定义

```typescript
// types/gdp.ts
export type TimeGranularity = 'year' | 'half';

export interface GDPData {
  regionCode: string;
  year: number;           // 2015-2024
  granularity: TimeGranularity;
  period: 1 | 2;          // 1=年度/上半年, 2=下半年
  value: number;          // GDP数值（亿元）
}

// types/region.ts
export interface Region {
  code: string;           // 行政区划代码
  name: string;           // 区域名称
  level: 1 | 2 | 3;       // 1=省, 2=市, 3=区
  parentCode: string | null;
  path: string;           // 完整路径，如"广东省深圳市"
}
```

### 3.2 数据文件

| 文件 | 描述 | 大小 | 记录数 |
|:---|:---|:---|:---|
| `regions.json` | 148 个区域元数据 | ~20KB | 148 条 |
| `gdp-annual.json` | 年度 GDP 数据 | ~150KB | 1,260 条 |
| `gdp-half.json` | 半年度 GDP 数据 | ~1.4KB | 少量 |

### 3.3 数据来源与更新

**数据来源**:
- 国家统计局官方统计数据
- 各市统计局年度公报
- 新浪财经、第一财经等权威财经媒体

**数据时效**:
- 最新数据: 2024年年度 GDP
- 时间跨度: 2015-2024（共10年）
- 更新频率: 每年一次（次年3-4月发布前一年完整数据）
- 2025年数据: 预计2026年3-4月由各城市统计局发布

**数据格式示例**:
```typescript
// GDP 数据记录
{
  "regionCode": "440300",    // 深圳市
  "year": 2024,              // 数据年份
  "granularity": "year",     // 年度数据
  "period": 1,               // 1=年度/上半年
  "value": 36801.87          // GDP数值（亿元）
}
```

### 3.3 数据加载工具

```typescript
// utils/dataLoader.ts
export function getRegionByCode(code: string): Region | undefined;
export function getRegionHistory(code: string): GDPData[];
export function getGDPValue(code: string, year: number, granularity: TimeGranularity): number | null;
```

---

## 4. 组件设计

### 4.1 页面组件

| 组件 | 路径 | 职责 |
|:---|:---|:---|
| `HomePage` | `pages/HomePage.tsx` | 首页，搜索入口 |
| `ResultPage` | `pages/ResultPage.tsx` | 详情页，三栏布局 |

### 4.2 业务组件

| 组件 | 路径 | 职责 |
|:---|:---|:---|
| `SearchBox` | `components/SearchBox.tsx` | 智能搜索框，防抖 300ms |
| `RegionInfoCard` | `components/RegionInfoCard.tsx` | 区域基本信息展示 |
| `GDPTrendChart` | `components/GDPTrendChart.tsx` | Recharts 趋势图 |
| `SimilarRegionsList` | `components/SimilarRegionsList.tsx` | 相似区域推荐 |
| `ProvinceRankingList` | `components/ProvinceRankingList.tsx` | 省内排名列表 |

### 4.3 UI 组件

| 组件 | 来源 | 用途 |
|:---|:---|:---|
| `Card`, `Button`, `Input` | Radix UI + 自定义 | 基础 UI |
| `Badge` | 自定义 | 标签展示 |

---

## 5. 核心算法实现

### 5.1 搜索算法

```typescript
// utils/search.ts
export function searchRegions(query: string, limit: number = 10): SearchResult[];
```

**实现要点**:
- 多字段匹配（名称、代码、路径）
- 拼音匹配支持
- 结果相关性排序
- 关键词高亮

### 5.2 相似区域算法

```typescript
// utils/similarity.ts
export function findSimilarRegions(
  regionCode: string, 
  options: { limit: number; sameLevelOnly: boolean; year: number }
): SimilarRegion[];
```

**算法逻辑**:
1. 获取目标区域指定年份 GDP 值
2. 筛选同级别且不同省份的区域
3. 计算差值：`diff = |targetGDP - candidateGDP|`
4. 计算百分比：`diffPercent = diff / targetGDP * 100`
5. 按差值升序排序，取前 N 个

### 5.3 省内排名算法

```typescript
// utils/ranking.ts
export function getProvinceRanking(regionCode: string): RankingItem[];
```

**实现逻辑**:
1. 解析区域所属省份
2. 筛选同省同级别区域
3. 按 GDP 数值降序排序
4. 计算当前区域排名位置

---

## 6. 路由设计

| 路由 | 组件 | 描述 |
|:---|:---|:---|
| `/` | `HomePage` | 首页 |
| `/region/:code` | `ResultPage` | 区域详情页，`:code` 为行政区划代码 |

---

## 7. 部署架构

```
┌─────────────────────────────────────────┐
│           Caddy / Nginx                 │
│         (Reverse Proxy)                 │
│     https://compare.carrick7.com        │
├─────────────────────────────────────────┤
│           Static Files                  │
│         /var/www/compare/dist           │
│  ├── index.html                         │
│  ├── assets/                            │
│  │   ├── index-xxx.js                   │
│  │   ├── index-xxx.css                  │
│  │   └── ...                            │
│  └── ...                                │
└─────────────────────────────────────────┘
```

### 构建命令

```bash
npm run build
# 输出到 dist/ 目录
```

### 部署配置

```caddy
compare.carrick7.com {
    root * /var/www/compare/dist
    try_files {path} /index.html
    file_server
}
```

---

## 8. 与 Product Spec 对应的功能实现

| Product Spec 功能 | Tech Spec 实现方案 |
|:---|:---|
| GDP 查询对比 | `search.ts` + `dataLoader.ts` + `SearchBox` 组件 |
| 相似区域推荐 | `similarity.ts` + `SimilarRegionsList` 组件 |
| 省内排名 | `ranking.ts` + `ProvinceRankingList` 组件 |
| 历史趋势图表 | `GDPTrendChart` 组件使用 Recharts |
| 热门城市快捷入口 | `getHotCities()` + `HomePage` 渲染 |
| 年度/半年度切换 | `TimeGranularity` 类型 + 状态管理 |

---

## 9. 性能优化

| 优化点 | 实现方式 |
|:---|:---|
| 搜索防抖 | 300ms 防抖延迟 |
| 数据缓存 | 内存中缓存解析后的 JSON |
| 组件懒加载 | React.lazy 按需加载 |
| 图表优化 | Recharts 仅渲染可视区域 |

---

## 10. 测试策略

| 测试类型 | 工具 | 覆盖范围 |
|:---|:---|:---|
| E2E 测试 | Playwright | 核心用户流程 |
| 类型检查 | TypeScript | 全代码库 |
| 代码规范 | ESLint | 全代码库 |

---

*Tech Spec v1.0 | Carrick Compare*
