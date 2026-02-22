import { test, expect } from '@playwright/test';

test.describe('首页测试', () => {
  test('首页加载正常，标题正确', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/carrick-compare/i);
  });

  test('页面包含主要标题', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=行政区域 GDP 对比')).toBeVisible();
    await expect(page.locator('text=查询中国各城市经济数据')).toBeVisible();
  });

  test('搜索框可见且可交互', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test('热门城市区域显示', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=热门城市')).toBeVisible();
    // 检查是否有热门城市卡片 (使用 Card 组件)
    const cards = page.locator('[class*="cursor-pointer"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('搜索功能正常 - 输入深圳', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await searchInput.fill('深圳');
    // 等待搜索结果出现
    await expect(page.locator('text=深圳市')).toBeVisible({ timeout: 5000 });
  });

  test('搜索功能正常 - 输入北京', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await searchInput.fill('北京');
    await expect(page.locator('text=北京市')).toBeVisible({ timeout: 5000 });
  });

  test('点击热门城市跳转到结果页', async ({ page }) => {
    await page.goto('/');
    // 点击第一个热门城市
    await page.locator('[class*="cursor-pointer"]').first().click();
    // 验证跳转后 URL 包含 region
    await expect(page).toHaveURL(/\/region\//);
  });
});