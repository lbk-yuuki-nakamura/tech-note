import type { Metadata } from 'next';
import { filterPosts, getAllTags } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import TagFilter from '@/components/TagFilter';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import RememberListUrl from '@/components/RememberListUrl';

const PAGE_SIZE = 10;

export const metadata: Metadata = {
  title: '記事一覧',
  description: 'プログラミングに関する技術記事の一覧です。',
  openGraph: {
    title: '記事一覧 | Tech Note',
    description: 'プログラミングに関する技術記事の一覧です。',
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[]; q?: string; page?: string }>;
}) {
  const { tag, q, page } = await searchParams;
  const selectedTags = Array.isArray(tag) ? tag : tag ? [tag] : [];
  const allTags = getAllTags();
  const posts = filterPosts(q, selectedTags);
  const isFiltered = Boolean(selectedTags.length || q);

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const parsedPage = Number.parseInt(page ?? '1', 10);
  const currentPage = Number.isFinite(parsedPage)
    ? Math.min(Math.max(parsedPage, 1), totalPages)
    : 1;
  const pagedPosts = posts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <RememberListUrl />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-100">Tech Note</h1>
        <p className="text-slate-400">プログラマーの技術メモ</p>
      </div>

      <div className="mb-6">
        <SearchInput defaultValue={q} currentTags={selectedTags} />
      </div>

      {allTags.length > 0 && (
        <div className="mb-6">
          <TagFilter tags={allTags} selectedTags={selectedTags} currentQuery={q} />
        </div>
      )}

      {isFiltered && (
        <p className="mb-4 text-sm text-slate-400" data-testid="filter-summary">
          {q && (
            <>
              「<strong className="text-slate-200">{q}</strong>」
            </>
          )}
          {q && selectedTags.length > 0 && ' + '}
          {selectedTags.length > 0 && (
            <>
              タグ
              {selectedTags.map((t) => (
                <span key={t}>
                  「<strong className="text-slate-200">{t}</strong>」
                </span>
              ))}
            </>
          )}
          の記事（{posts.length}件）
        </p>
      )}

      <section>
        {posts.length === 0 ? (
          <p className="text-slate-500" data-testid="no-posts">
            記事が見つかりませんでした。
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-4" data-testid="post-list">
              {pagedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              query={q}
              tags={selectedTags}
            />
          </>
        )}
      </section>
    </div>
  );
}
