# Tech Note

プログラマー向け個人技術ブログ。Markdownファイルで記事を管理し、Next.js で静的/動的ハイブリッドレンダリングするブログサービス。

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Markdown**: gray-matter / unified / remark / rehype
- **Testing**: Playwright
- **Deploy**: Vercel

## 機能

- 記事一覧（日付降順）
- キーワード検索（タイトル・本文）
- タグフィルター（折りたたみ式）
- ダークテーマ
- SEO対応（メタタグ、OGP、sitemap.xml、robots.txt）
- 未来日の記事は非表示（予約公開）

## 記事の書き方

`posts/` ディレクトリに `.md` ファイルを作成する。ファイル名がURLのスラッグになる。

```markdown
---
title: 記事タイトル
createAt: "2025-01-01 10:00"
updateAt: null
tags: [TypeScript, React]
---

記事の本文（Markdown）
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `title` | string | 記事タイトル |
| `createAt` | string | 作成日時。未来日の場合は非表示 |
| `updateAt` | string \| null | 更新日時。`null` で非表示 |
| `tags` | string[] | タグ一覧 |

## ディレクトリ構成

```
tech-note/
├── posts/                    # 実際の記事（.md）← ここに記事を追加する
├── __fixtures__/posts/       # テスト用モック記事（変更しない）
├── src/
│   ├── app/
│   │   ├── page.tsx          # 記事一覧ページ（/）
│   │   ├── blog/[slug]/      # 記事詳細ページ（/blog/:slug）
│   │   ├── sitemap.ts        # sitemap.xml
│   │   └── robots.ts         # robots.txt
│   ├── components/
│   │   ├── BlogCard.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchInput.tsx   # キーワード検索（client component）
│   │   ├── TagBadge.tsx
│   │   └── TagFilter.tsx     # タグ折りたたみ（client component）
│   └── lib/
│       ├── posts.ts          # 記事読み込み・フィルタリングロジック
│       └── types.ts
├── tests/                    # Playwright E2Eテスト
└── playwright.config.ts
```

## セットアップ

```bash
npm install
npx playwright install chromium
```

## 開発

```bash
npm run dev       # 開発サーバー起動（http://localhost:3000）
npm run build     # プロダクションビルド
npm run start     # プロダクションサーバー起動
```

## テスト

```bash
npm test          # Playwright E2Eテスト実行（モック記事を使用）
npm run test:ui   # Playwright UI モードで実行
```

テストは `__fixtures__/posts/` のモック記事を使用する（環境変数 `POSTS_DIR` で切り替え）。実際の `posts/` ディレクトリはテストに影響しない。

## 環境変数

`.env.local.example` をコピーして `.env.local` を作成する。

| 変数名 | 用途 | デフォルト |
|--------|------|-----------|
| `NEXT_PUBLIC_SITE_URL` | sitemap・OGP の絶対URL生成 | `http://localhost:3000` |

## デプロイ（Vercel）

1. Vercel にリポジトリを連携
2. 環境変数 `NEXT_PUBLIC_SITE_URL` にデプロイ先のURLを設定
3. `git push` で自動デプロイ

記事を追加・更新するときは `posts/` にファイルをコミットしてプッシュするだけで反映される。
