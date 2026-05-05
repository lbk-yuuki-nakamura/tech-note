import { test, expect } from '@playwright/test';

test.describe('ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページタイトルが正しい', async ({ page }) => {
    await expect(page).toHaveTitle(/記事一覧/);
  });

  test('サイト名が表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tech Note' })).toBeVisible();
  });

  test('全記事が表示される（4件）', async ({ page }) => {
    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(4);
  });

  test('記事が日付の降順で並んでいる', async ({ page }) => {
    const cards = page.getByTestId('blog-card');
    const firstTitle = await cards.first().getByRole('heading').textContent();
    // Most recent post is React Hooks (2025-04-05)
    expect(firstTitle).toContain('Reactフックの使い方まとめ');
  });

  test('タグフィルターが表示される', async ({ page }) => {
    await expect(page.getByTestId('tag-filter')).toBeVisible();
  });

  test('全タグが表示される', async ({ page }) => {
    const tagFilter = page.getByTestId('tag-filter');
    await expect(tagFilter).toContainText('JavaScript');
    await expect(tagFilter).toContainText('TypeScript');
    await expect(tagFilter).toContainText('React');
    await expect(tagFilter).toContainText('Next.js');
  });

  test('ヘッダーが表示される', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
  });

  test('フッターが表示される', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  test('記事カードに日付が表示される', async ({ page }) => {
    const firstCard = page.getByTestId('blog-card').first();
    await expect(firstCard.getByTestId('post-date')).toBeVisible();
  });

  test('meta descriptionが設定されている', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /記事/);
  });
});
