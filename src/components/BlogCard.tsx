import Link from 'next/link';
import type { PostMeta } from '@/lib/types';
import TagBadge from './TagBadge';

interface Props {
  post: PostMeta;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function BlogCard({ post }: Props) {
  const { slug, frontmatter } = post;
  return (
    <article className="rounded-xl border border-slate-700 bg-slate-800 p-6 transition-all hover:border-slate-500" data-testid="blog-card">
      <Link href={`/blog/${slug}`} className="block">
        <h2 className="mb-2 text-xl font-semibold text-slate-100 hover:text-blue-400">
          {frontmatter.title}
        </h2>
      </Link>
      <div className="mb-3 flex items-center gap-3 text-sm text-slate-400">
        <time dateTime={frontmatter.createAt} data-testid="post-date">
          {formatDate(frontmatter.createAt)}
        </time>
        {frontmatter.updateAt && (
          <span className="text-xs text-slate-500">
            更新: {formatDate(frontmatter.updateAt)}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {frontmatter.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
