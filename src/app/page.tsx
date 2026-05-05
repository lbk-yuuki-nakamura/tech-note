import type { Metadata } from 'next';
import { filterPosts, getAllTags } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import TagFilter from '@/components/TagFilter';
import SearchInput from '@/components/SearchInput';

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
  searchParams: Promise<{ tag?: string; q?: string }>;
}) {
  const { tag, q } = await searchParams;
  const allTags = getAllTags();
  const posts = filterPosts(q, tag);
  const isFiltered = Boolean(tag || q);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-100">Tech Note</h1>
        <p className="text-slate-400">プログラマーの技術メモ</p>
      </div>

      <div className="mb-6">
        <SearchInput defaultValue={q} currentTag={tag} />
      </div>

      {allTags.length > 0 && (
        <div className="mb-6">
          <TagFilter tags={allTags} activeTag={tag} currentQuery={q} />
        </div>
      )}

      {isFiltered && (
        <p className="mb-4 text-sm text-slate-400" data-testid="filter-summary">
          {q && (
            <>
              「<strong className="text-slate-200">{q}</strong>」
            </>
          )}
          {q && tag && ' + '}
          {tag && (
            <>
              タグ「<strong className="text-slate-200">{tag}</strong>」
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
          <div className="flex flex-col gap-4" data-testid="post-list">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
