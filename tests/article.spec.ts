import { test, expect } from '@playwright/test';

test.describe('記事ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/hello-world');
  });

  test('記事タイトルが表示される', async ({ page }) => {
    await expect(page.getByTestId('article-title')).toContainText('Hello World');
  });

  test('ページタイトルにタイトルが含まれる', async ({ page }) => {
    await expect(page).toHaveTitle(/Hello World/);
  });

  test('日付が表示される', async ({ page }) => {
    await expect(page.getByTestId('article-date')).toBeVisible();
  });

  test('タグが表示される', async ({ page }) => {
    await expect(page.getByTestId('article-tags')).toContainText('JavaScript');
  });

  test('記事本文が表示される', async ({ page }) => {
    const content = page.getByTestId('article-content');
    await expect(content).toBeVisible();
    await expect(content).toContainText('このブログを始めました');
  });

  test('記事一覧へのバックリンクがある', async ({ page }) => {
    await expect(page.getByTestId('back-link')).toBeVisible();
  });

  test('バックリンクをクリックするとホームに戻る', async ({ page }) => {
    await page.getByTestId('back-link').click();
    await expect(page).toHaveURL('/');
  });

  test('更新日なしの場合は更新日が表示されない', async ({ page }) => {
    await expect(page.getByTestId('article-update-date')).not.toBeVisible();
  });

  test('TypeScript記事 - 更新日が表示される', async ({ page }) => {
    await page.goto('/blog/typescript-tips');
    await expect(page.getByTestId('article-update-date')).toBeVisible();
  });

  test('TypeScript記事 - タグが複数表示される', async ({ page }) => {
    await page.goto('/blog/typescript-tips');
    const tags = page.getByTestId('article-tags');
    await expect(tags).toContainText('TypeScript');
    await expect(tags).toContainText('JavaScript');
  });

  test('Next.js記事 - コードブロックが表示される', async ({ page }) => {
    await page.goto('/blog/nextjs-guide');
    const content = page.getByTestId('article-content');
    await expect(content.locator('pre')).toBeVisible();
  });

  test('存在しない記事は404になる', async ({ page }) => {
    const response = await page.goto('/blog/non-existent-post');
    expect(response?.status()).toBe(404);
  });

  test('OGPタグが設定されている', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Hello World/);
  });
});
