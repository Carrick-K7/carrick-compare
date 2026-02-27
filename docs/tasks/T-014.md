# T-014: Tailwind CSS v4 降级到 v3（Safari 兼容性修复）

## 目标
将 Compare 项目从 Tailwind CSS v4 降级到 v3，解决 Safari 兼容性问题。

## 问题分析
- **当前**: Tailwind CSS v4 + `@theme` 新语法
- **问题**: Safari 不兼容 `oklch()` 颜色、`@layer`、`@theme` 等现代 CSS 特性
- **解决方案**: 降级到 Tailwind CSS v3，使用传统配置方式

## 降级清单

### 1. 依赖变更 ✅
- [x] 卸载: `tailwindcss@^4.2.0`, `@tailwindcss/postcss`, `@tailwindcss/vite`, `@csstools/postcss-oklab-function`
- [x] 安装: `tailwindcss@^3.4.0`, `autoprefixer@^10.4.0`, `postcss@^8.4.0`

### 2. 配置文件变更 ✅
- [x] 删除: `postcss.config.mjs` (v4 版本)
- [x] 创建: `tailwind.config.js` (v3 配置)
- [x] 创建: `postcss.config.js` (v3 版本)
- [x] 更新: `.browserslistrc` (Safari 14+ 支持)

### 3. CSS 文件重写 ✅
- [x] 重写 `src/index.css`:
  - 移除 `@import "tailwindcss"`
  - 移除 `@theme` 块
  - 添加 `@tailwind base; @tailwind components; @tailwind utilities;`
  - 将 HSL 颜色定义移到 `:root`

### 4. 额外依赖 ✅
- [x] 安装: `tailwindcss-animate` 插件

### 5. 构建验证 ✅
- [x] `npm run build` 成功
- [x] CSS 输出不包含 `oklch` 或 `@theme`
- [x] CSS 文件大小: 5.84KB gzipped (从 81KB 减少)

### 6. QA 检查 ✅
- [x] `npm run lint` 通过
- [x] Playwright 测试: 18/18 通过

### 7. 部署 ✅
- [x] Git 提交推送
- [x] 部署到生产环境 `/var/www/compare.carrick7.com/`

## 验收标准
- [x] Tailwind v3 构建成功
- [x] CSS 输出无 `oklch`/`@theme` (Safari 兼容)
- [x] 所有原有功能正常（搜索、图表、对比等）
- [x] Playwright 测试通过
- [x] Git 提交推送
- [x] 重新部署

## 进度
| 时间 | 事件 | 状态 |
|:---:|:---|:---:|
| 2026-02-22 | Task 创建 | ✅ |
| 2026-02-22 | Tailwind v4 → v3 降级完成 | ✅ |

## 提交记录
- `6d2b5ae` fix(T-014): Tailwind CSS v4降级到v3，修复Safari兼容性

## 变更摘要
| 项目 | v4 (之前) | v3 (之后) |
|:---|:---|:---|
| Tailwind 版本 | 4.2.0 | 3.4.0 |
| CSS 语法 | `@import "tailwindcss"` + `@theme` | `@tailwind` 指令 |
| CSS 大小 (gzipped) | ~81KB | 5.84KB |
| 颜色格式 | oklch | HSL |
| 配置文件 | 无 | `tailwind.config.js` |
| PostCSS 配置 | `postcss.config.mjs` | `postcss.config.js` |
