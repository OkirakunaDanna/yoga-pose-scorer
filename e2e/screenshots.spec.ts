import { test, expect } from '@playwright/test';

test.describe('画面の見方 - スクリーンショット', () => {
  test('初期表示のスクリーンショット', async ({ page }) => {
    // ページを開く
    await page.goto('/');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // タイトルと説明文が表示されるまで待つ
    await expect(page.locator('h1')).toBeVisible();
    
    // フルページのスクリーンショット
    await page.screenshot({ path: './screenshots/01_初期表示.png', fullPage: true });
  });

  test('木のポーズ選択時のスクリーンショット', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ポーズ選択ドロップダウンを取得
    const poseSelect = page.locator('select, button').first();
    await poseSelect.click();
    
    // 少し待つ
    await page.waitForTimeout(500);
    
    // スクリーンショット
    await page.screenshot({ path: './screenshots/02_木のポーズ選択.png', fullPage: true });
  });

  test('戦士のポーズ2選択時のスクリーンショット', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ポーズ選択ドロップダウンから「戦士のポーズ2」を選択
    const poseSelect = page.locator('select');
    if (await poseSelect.isVisible()) {
      await poseSelect.selectOption({ label: '戦士のポーズ2' });
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: './screenshots/03_戦士のポーズ2選択.png', fullPage: true });
  });

  test('下向きの犬選択時のスクリーンショット', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ポーズ選択ドロップダウンから「下向きの犬」を選択
    const poseSelect = page.locator('select');
    if (await poseSelect.isVisible()) {
      await poseSelect.selectOption({ label: '下向きの犬' });
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: './screenshots/04_下向きの犬選択.png', fullPage: true });
  });

  test('デスクトップレイアウトのスクリーンショット (1200px)', async ({ page }) => {
    // デスクトップサイズで表示
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: './screenshots/05_デスクトップレイアウト_1200x800.png', fullPage: false });
  });

  test('モバイルレイアウトのスクリーンショット (375px)', async ({ page }) => {
    // モバイルサイズで表示
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: './screenshots/06_モバイルレイアウト_375x812.png', fullPage: true });
  });
});
