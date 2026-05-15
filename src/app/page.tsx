import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPostsWithContent, getAllTags } from '@/lib/posts';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: '記事一覧',
  description: 'プログラミングに関する技術記事の一覧です。',
  openGraph: {
    title: '記事一覧 | Tech Note',
    description: 'プログラミングに関する技術記事の一覧です。',
  },
};

export default function HomePage() {
  const posts = getAllPostsWithContent();
  const allTags = getAllTags();
  return (
    <Suspense>
      <HomePageClient posts={posts} allTags={allTags} />
    </Suspense>
  );
}
