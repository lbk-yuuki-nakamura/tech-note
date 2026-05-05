'use client';
import { useState } from 'react';
import TagBadge from './TagBadge';

interface Props {
  tags: { tag: string; count: number }[];
  activeTag?: string;
  currentQuery?: string;
}

export default function TagFilter({ tags, activeTag, currentQuery }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-300"
        data-testid="tag-filter-toggle"
        aria-expanded={isOpen}
      >
        <span>タグ</span>
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 flex flex-wrap gap-2" data-testid="tag-filter">
          {tags.map(({ tag, count }) => (
            <span key={tag} className="flex items-center gap-1">
              <TagBadge tag={tag} active={tag === activeTag} currentQuery={currentQuery} />
              <span className="text-xs text-slate-500">({count})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
