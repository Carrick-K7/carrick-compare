# T-014: Tailwind CSS v4 降级到 v3（Safari 兼容性修复）

## 目标
将 Compare 项目从 Tailwind CSS v4 降级到 v3，解决 Safari 兼容性问题。

## 问题分析
- **当前**: Tailwind CSS v4 + `@theme` 新语法
- **问题**: Safari 不兼容 `oklch()` 颜色、`@layer`、`@theme` 等现代 CSS 特性
- **解决方案**: 降级到 Tailwind CSS v3，使用传统配置方式

## 降级清单

### 1. 依赖变更
- [ ] 卸载: `tailwindcss@^4.2.0`, `@tailwindcss/postcss`, `@tailwindcss/vite`
- [ ] 安装: `tailwindcss@^3.4.0`, `autoprefixer@^10.4.0`, `postcss@^8.4.0`

### 2. 配置文件变更
- [ ] 删除: `postcss.config.mjs` (v4 版本)
- [ ] 创建: `tailwind.config.js` (v3 配置)
- [ ] 创建: `postcss.config.js` (v3 版本)
- [ ] 更新: `.browserslistrc` (保持 Safari 14+ 支持)

### 3. CSS 文件重写
- [ ] 重写 `src/index.css`:
  - 移除 `@import "tailwindcss"`
  - 移除 `@theme` 块
  - 添加 `@tailwind base; @tailwind components; @tailwind utilities;`
  - 将 HSL 颜色定义移到 `:root` 或 Tailwind 配置中

### 4. 组件样式检查
- [ ] 检查所有组件中的 Tailwind 类名
- [ ] 确保 `border-border`, `bg-background` 等自定义类正常工作
- [ ] 修复可能不兼容的任意值类名（如 `bg-[hsl(...)]`）

### 5. 构建验证
- [ ] `npm run build` 成功
- [ ] CSS 输出包含标准 Tailwind 类名（非 `oklch`）
- [ ] 文件大小合理（v3 通常在 10-15KB gzipped）

### 6. 浏览器测试
- [ ] Safari 14+ 正常显示
- [ ] Chrome/Firefox 正常
- [ ] 移动端 Safari 正常

## 验收标准
- [ ] Tailwind v3 构建成功
- [ ] CSS 在 Safari 中正常显示
- [ ] 所有原有功能正常（搜索、图表、对比等）
- [ ] Playwright 测试通过
- [ ] Git 提交推送
- [ ] 重新部署

## 进度
| 时间 | 事件 | 状态 |
|:---:|:---|:---:|
| 2026-02-22 | Task 创建 | ✅ |

## 提交记录
- 待添加
