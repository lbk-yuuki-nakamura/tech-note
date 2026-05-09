import Link from 'next/link';

interface Props {
  currentPage: number;
  totalPages: number;
  query?: string;
  tags?: string[];
}

function buildHref(page: number, query?: string, tags?: string[]): string {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  for (const t of tags ?? []) params.append('tag', t);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

const baseLink =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100';
const activeLink =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-blue-500 bg-blue-500 px-3 text-sm font-semibold text-white';
const disabledLink =
  'inline-flex h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-slate-600';

export default function Pagination({ currentPage, totalPages, query, tags }: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="ページネーション"
      data-testid="pagination"
    >
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1, query, tags)}
          className={baseLink}
          aria-label="前のページ"
          data-testid="pagination-prev"
        >
          ‹ 前へ
        </Link>
      ) : (
        <span className={disabledLink} aria-disabled="true">
          ‹ 前へ
        </span>
      )}

      <span
        className="inline-flex h-9 items-center justify-center px-2 text-sm text-slate-400 sm:hidden"
        data-testid="pagination-mobile-status"
      >
        {currentPage} / {totalPages}
      </span>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span
              key={`e-${idx}`}
              className="inline-flex h-9 min-w-9 items-center justify-center px-1 text-sm text-slate-500"
              aria-hidden="true"
            >
              …
            </span>
          ) : p === currentPage ? (
            <span key={p} className={activeLink} aria-current="page" data-testid="pagination-current">
              {p}
            </span>
          ) : (
            <Link key={p} href={buildHref(p, query, tags)} className={baseLink}>
              {p}
            </Link>
          )
        )}
      </div>

      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1, query, tags)}
          className={baseLink}
          aria-label="次のページ"
          data-testid="pagination-next"
        >
          次へ ›
        </Link>
      ) : (
        <span className={disabledLink} aria-disabled="true">
          次へ ›
        </span>
      )}
    </nav>
  );
}
