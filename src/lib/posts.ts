import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import type { Post, PostFrontmatter, PostMeta, PostMetaWithContent } from './types';

function getPostsDir(): string {
  return path.join(process.cwd(), process.env.POSTS_DIR ?? 'posts');
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return String(value);
}

function isFutureDate(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

function parseFrontmatter(data: Record<string, unknown>): PostFrontmatter {
  const rawTags = data.tags ?? data.tag ?? [];
  const tags = Array.isArray(rawTags) ? rawTags.map(String) : [];

  return {
    title: typeof data.title === 'string' ? data.title : '',
    createAt: normalizeDate(data.createAt),
    updateAt: data.updateAt != null ? normalizeDate(data.updateAt) : null,
    tags,
  };
}

export function getAllPostsMeta(): PostMeta[] {
  const postsDir = getPostsDir();
  if (!fs.existsSync(postsDir)) return [];

  const filenames = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      frontmatter: parseFrontmatter(data as Record<string, unknown>),
    };
  });

  return posts
    .filter((post) => !isFutureDate(post.frontmatter.createAt))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.createAt).getTime() -
        new Date(a.frontmatter.createAt).getTime()
    );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postsDir = getPostsDir();
  const fullPath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const frontmatter = parseFrontmatter(data as Record<string, unknown>);
  if (isFutureDate(frontmatter.createAt)) return null;

  return {
    slug,
    frontmatter,
    contentHtml: processedContent.toString(),
  };
}

export function getAllPostsWithContent(): PostMetaWithContent[] {
  const postsDir = getPostsDir();
  if (!fs.existsSync(postsDir)) return [];

  const filenames = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  return filenames
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontmatter = parseFrontmatter(data as Record<string, unknown>);
      return { slug, frontmatter, rawContent: content };
    })
    .filter((post) => !isFutureDate(post.frontmatter.createAt))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.createAt).getTime() -
        new Date(a.frontmatter.createAt).getTime()
    );
}

export function filterPosts(query?: string, tags?: string[]): PostMeta[] {
  const q = query?.toLowerCase().trim();
  const matchesTags = (postTags: string[]) =>
    !tags || tags.length === 0 || tags.every((t) => postTags.includes(t));

  if (!q) {
    return getAllPostsMeta().filter((p) => matchesTags(p.frontmatter.tags));
  }

  const postsDir = getPostsDir();
  if (!fs.existsSync(postsDir)) return [];

  const filenames = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  return filenames
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontmatter = parseFrontmatter(data as Record<string, unknown>);
      return { slug, frontmatter, rawContent: content };
    })
    .filter((post) => !isFutureDate(post.frontmatter.createAt))
    .filter((post) => matchesTags(post.frontmatter.tags))
    .filter(
      (post) =>
        post.frontmatter.title.toLowerCase().includes(q) ||
        post.rawContent.toLowerCase().includes(q)
    )
    .sort(
      (a, b) =>
        new Date(b.frontmatter.createAt).getTime() -
        new Date(a.frontmatter.createAt).getTime()
    )
    .map(({ slug, frontmatter }) => ({ slug, frontmatter }));
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPostsMeta();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
