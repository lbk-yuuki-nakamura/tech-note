import { test, expect } from '@playwright/test';

test.describe('タグフィルター', () => {
  test('TypeScriptタグでフィルタリング', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'TypeScript' }).first().click();
    await expect(page).toHaveURL('/?tag=TypeScript');

    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(2); // typescript-tips, nextjs-guide
  });

  test('JavaScriptタグでフィルタリング', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'JavaScript' }).first().click();
    await expect(page).toHaveURL('/?tag=JavaScript');

    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(3); // hello-world, typescript-tips, react-hooks
  });

  test('Reactタグでフィルタリング', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'React' }).first().click();
    await expect(page).toHaveURL('/?tag=React');

    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(2); // nextjs-guide, react-hooks
  });

  test('フィルタリング中はタグがアクティブ表示になる', async ({ page }) => {
    await page.goto('/?tag=TypeScript');
    // Active tag badge has different styling (bg-blue-600)
    const activeTag = page.getByTestId('tag-filter').locator('a.bg-blue-500');
    await expect(activeTag).toContainText('TypeScript');
  });

  test('フィルタリング件数が表示される', async ({ page }) => {
    await page.goto('/?tag=TypeScript');
    await expect(page.getByText(/の記事（2件）/)).toBeVisible();
  });

  test('アクティブタグをクリックするとフィルタ解除', async ({ page }) => {
    await page.goto('/?tag=TypeScript');
    await page.getByTestId('tag-filter').locator('a.bg-blue-500').click();
    await expect(page).toHaveURL('/');

    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(4);
  });

  test('存在しないタグでフィルタリングすると「見つかりません」が表示される', async ({ page }) => {
    await page.goto('/?tag=NonExistentTag');
    await expect(page.getByTestId('no-posts')).toBeVisible();
  });

  test('URLにタグを直接指定してアクセスできる', async ({ page }) => {
    await page.goto('/?tag=Next.js');
    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(1); // nextjs-guide
  });

  test('記事ページのタグをクリックするとフィルタリングされる', async ({ page }) => {
    await page.goto('/blog/typescript-tips');
    await page.getByTestId('article-tags').getByRole('link', { name: 'TypeScript' }).click();
    await expect(page).toHaveURL('/?tag=TypeScript');
    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(2); // typescript-tips, nextjs-guide
  });
});
