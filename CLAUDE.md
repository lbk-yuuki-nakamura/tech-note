# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server on http://localhost:3000 (Turbopack)
npm run build      # Production build
npm test           # Playwright E2E tests (starts its own server on port 3001)
npm run test:ui    # Playwright UI mode
npm run test:report # Show last test HTML report
```

Run a single test file:
```bash
npx playwright test tests/home.spec.ts
```

Run a single test by name:
```bash
npx playwright test -g "タイトルでの検索"
```

## Architecture

### Content pipeline

Articles are `.md` files in `posts/`. All reading logic is in `src/lib/posts.ts`:

- `getAllPostsMeta()` — reads frontmatter only (fast path, used for listing/tags)
- `filterPosts(query?, tag?)` — combines tag filtering and full-text search. When `query` is present it reads file bodies; otherwise delegates to `getAllPostsMeta()`
- `getPostBySlug(slug)` — reads one file and converts Markdown → HTML via `unified` → `remark` → `rehype` → `rehype-highlight`
- Posts with a future `createAt` are silently filtered out everywhere

The posts directory is resolved at runtime via `process.env.POSTS_DIR ?? 'posts'`. Tests override this to `__fixtures__/posts` so real articles never affect test results.

### Rendering model

- `/` (`page.tsx`) — Dynamic server component (uses `searchParams`). Calls `filterPosts` on every request.
- `/blog/[slug]` — SSG via `generateStaticParams` at build time; `generateMetadata` provides per-post SEO tags. OGP/canonical use relative paths because `metadataBase` in `layout.tsx` resolves them.
- `SearchInput`, `TagFilter` — `'use client'` components. `SearchInput` debounces URL pushes (300 ms); Enter key bypasses debounce. `TagFilter` holds open/closed state locally.
- `TagBadge` accepts a `currentQuery` prop so clicking a tag preserves an active search query in the URL, and vice-versa.

### SEO

`metadataBase` is set in `layout.tsx` from `NEXT_PUBLIC_SITE_URL`. This env var is also required by `sitemap.ts` and `robots.ts` (those must emit absolute URLs per spec). Relative paths are fine everywhere else.

### Vercel deployment

`next.config.ts` sets `outputFileTracingIncludes` so that `posts/**/*` is bundled into serverless functions. Without this, Vercel's file-tracing misses the dynamically-read markdown files and the site shows no articles.

## Testing conventions

- All Playwright tests use `data-testid` attributes — don't remove them from components.
- The test server starts with `POSTS_DIR=__fixtures__/posts`. Add new mock posts to `__fixtures__/posts/` when a test needs specific content; never rely on `posts/`.
- Tag/search count assertions must match the fixture data: JavaScript (3 posts), TypeScript (2), React (2), Next.js (1).
