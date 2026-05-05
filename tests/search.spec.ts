import { test, expect } from '@playwright/test';

test.describe('検索機能', () => {
  test('検索入力欄が表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('タイトルでの検索', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('Hello World');
    await page.getByTestId('search-input').press('Enter');
    await expect(page).toHaveURL(/q=Hello/);
    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Hello World');
  });

  test('本文でのキーワード検索', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('useState');
    await page.getByTestId('search-input').press('Enter');
    await expect(page).toHaveURL(/q=useState/);
    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Reactフックの使い方まとめ');
  });

  test('本文の別キーワードで検索（satisfies）', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('search-input').fill('satisfies');
    await page.getByTestId('search-input').press('Enter');
    await expect(page).toHaveURL(/q=satisfies/);
    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('TypeScriptの便利なTips集');
  });

  test('マッチしない検索で「見つかりません」が表示される', async ({ page }) => {
    await page.goto('/?q=xyzabc_no_match');
    await expect(page.getByTestId('no-posts')).toBeVisible();
  });

  test('検索結果にフィルター件数が表示される', async ({ page }) => {
    await page.goto('/?q=useState');
    await expect(page.getByTestId('filter-summary')).toBeVisible();
    await expect(page.getByTestId('filter-summary')).toContainText('1件');
  });

  test('検索とタグの組み合わせ', async ({ page }) => {
    // Search within React-tagged posts
    await page.goto('/?q=useState&tag=React');
    const cards = page.getByTestId('blog-card');
    await expect(cards).toHaveCount(1);
    await expect(page.getByTestId('filter-summary')).toContainText('useState');
    await expect(page.getByTestId('filter-summary')).toContainText('React');
  });

  test('検索入力欄にデフォルト値が入る（URLパラメータから）', async ({ page }) => {
    await page.goto('/?q=TypeScript');
    const input = page.getByTestId('search-input');
    await expect(input).toHaveValue('TypeScript');
  });

  test('検索クリアで全件表示に戻る', async ({ page }) => {
    await page.goto('/?q=useState');
    await expect(page.getByTestId('blog-card')).toHaveCount(1);
    // Clear the search by navigating to home
    await page.goto('/');
    await expect(page.getByTestId('blog-card')).toHaveCount(4);
  });
});

test.describe('タグフィルター折りたたみ', () => {
  test('デフォルトでタグが表示されている', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('tag-filter')).toBeVisible();
  });

  test('トグルボタンをクリックするとタグが非表示になる', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('tag-filter')).toBeVisible();
    await page.getByTestId('tag-filter-toggle').click();
    await expect(page.getByTestId('tag-filter')).not.toBeVisible();
  });

  test('折りたたんだ後に再クリックで再表示される', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tag-filter-toggle').click();
    await expect(page.getByTestId('tag-filter')).not.toBeVisible();
    await page.getByTestId('tag-filter-toggle').click();
    await expect(page.getByTestId('tag-filter')).toBeVisible();
  });

  test('aria-expanded属性が切り替わる', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByTestId('tag-filter-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
