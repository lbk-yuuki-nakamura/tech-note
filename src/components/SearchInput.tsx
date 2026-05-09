'use client';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

interface Props {
  defaultValue?: string;
  currentTags?: string[];
}

export default function SearchInput({ defaultValue, currentTags }: Props) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = (value: string) => {
    const params = new URLSearchParams();
    if (value.trim()) params.set('q', value.trim());
    for (const t of currentTags ?? []) params.append('tag', t);
    const query = params.toString();
    router.push(query ? `/?${query}` : '/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => navigate(value), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timerRef.current) clearTimeout(timerRef.current);
      navigate((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="タイトル・本文を検索..."
        className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        data-testid="search-input"
      />
    </div>
  );
}
