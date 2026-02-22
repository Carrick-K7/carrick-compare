import { test, expect } from '@playwright/test';

test.describe('导航测试', () => {
  test('从首页跳转到结果页再返回', async ({ page }) => {
    // 访问首页
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // 搜索并选择深圳
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await searchInput.fill('深圳');
    await expect(page.locator('text=深圳市')).toBeVisible({ timeout: 5000 });
    await page.locator('text=深圳市').first().click();

    // 验证跳转到结果页
    await expect(page).toHaveURL(/\/region\/440300/);
    await expect(page.locator('text=当前查看')).toBeVisible();

    // 点击返回首页
    await page.locator('text=返回首页').first().click();

    // 验证回到首页
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=行政区域 GDP 对比')).toBeVisible();
  });

  test('直接访问带参数的结果页', async ({ page }) => {
    await page.goto('/region/110000'); // 北京市
    await expect(page).toHaveURL('/region/110000');
    await expect(page.locator('body')).toContainText('北京');
  });

  test('页面刷新后状态保持', async ({ page }) => {
    await page.goto('/region/310000'); // 上海市
    await expect(page.locator('body')).toContainText('上海');
    
    // 刷新页面
    await page.reload();
    
    // 验证页面仍然加载正常
    await expect(page.locator('body')).toContainText('上海');
    await expect(page.locator('text=当前查看')).toBeVisible();
  });

  test('浏览器后退前进正常', async ({ page }) => {
    // 访问首页
    await page.goto('/');
    
    // 跳转到结果页
    await page.goto('/region/440100'); // 广州市
    await expect(page.locator('body')).toContainText('广州');
    
    // 后退到首页
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // 前进到结果页
    await page.goForward();
    await expect(page).toHaveURL(/\/region\/440100/);
  });
});