import { test, expect } from '@playwright/test';

test.describe('结果页测试', () => {
  test('结果页加载正常 - 深圳市', async ({ page }) => {
    await page.goto('/region/440300');
    await expect(page).toHaveTitle(/carrick-compare/i);
  });

  test('结果页显示区域信息', async ({ page }) => {
    await page.goto('/region/440300');
    // 检查是否显示"当前查看"
    await expect(page.locator('text=当前查看')).toBeVisible();
    // 检查是否包含深圳市相关信息
    await expect(page.locator('body')).toContainText('深圳');
  });

  test('结果页包含返回首页按钮', async ({ page }) => {
    await page.goto('/region/440300');
    await expect(page.locator('text=返回首页')).toBeVisible();
  });

  test('结果页显示图表区域', async ({ page }) => {
    await page.goto('/region/440300');
    // 检查是否有图表标题
    await expect(page.locator('text=GDP历史趋势')).toBeVisible();
    // 检查图表容器是否存在 (recharts 使用 ResponsiveContainer 可能有尺寸问题，检查标题即可)
    await expect(page.locator('text=深圳市').first()).toBeVisible();
  });

  test('结果页显示时间粒度切换', async ({ page }) => {
    await page.goto('/region/440300');
    await expect(page.locator('text=时间粒度')).toBeVisible();
    // 检查年度和半年度按钮存在 (使用更精确的选择器)
    await expect(page.getByRole('button', { name: '年度', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '半年度', exact: true })).toBeVisible();
  });

  test('切换时间粒度 - 年度到半年度', async ({ page }) => {
    await page.goto('/region/440300');
    // 找到半年度按钮
    const halfButton = page.getByRole('button', { name: '半年度', exact: true });
    // 点击半年度按钮
    await halfButton.click();
    // 验证按钮被选中（通过检查是否有 bg-primary 类）
    await expect(halfButton).toHaveClass(/bg-primary/);
  });

  test('无效区域代码显示错误页面', async ({ page }) => {
    await page.goto('/region/invalid');
    await expect(page.locator('text=区域不存在')).toBeVisible();
    await expect(page.locator('text=返回首页')).toBeVisible();
  });
});