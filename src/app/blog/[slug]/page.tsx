import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPostsMeta, getPostBySlug } from '@/lib/posts';
import TagBadge from '@/components/TagBadge';
import BackLink from '@/components/BackLink';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPostsMeta();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const { title, createAt, tags } = post.frontmatter;

  return {
    title,
    description: `${title} - Tech Note`,
    keywords: tags,
    openGraph: {
      title,
      description: `${title} - Tech Note`,
      type: 'article',
      publishedTime: createAt,
      url: `/blog/${slug}`,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const { title, createAt, updateAt, tags } = post.frontmatter;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-2">
        <BackLink
          className="text-sm text-blue-400 hover:underline"
          testId="back-link"
        >
          ← 記事一覧へ
        </BackLink>
      </div>

      <article>
        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-bold text-slate-100" data-testid="article-title">
            {title}
          </h1>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <time dateTime={createAt} data-testid="article-date">
              {formatDate(createAt)}
            </time>
            {updateAt && (
              <span data-testid="article-update-date">
                更新: {formatDate(updateAt)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1" data-testid="article-tags">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </header>

        <div
          className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-400 prose-code:rounded prose-code:bg-slate-700 prose-code:px-1 prose-code:text-sm prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700"
          data-testid="article-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <div className="mt-10 border-t border-slate-700 pt-6">
        <BackLink className="text-sm text-blue-400 hover:underline">
          ← 記事一覧へ戻る
        </BackLink>
      </div>
    </div>
  );
}
