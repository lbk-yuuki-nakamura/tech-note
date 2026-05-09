import Link from 'next/link';

interface Props {
  tag: string;
  selectedTags?: string[];
  currentQuery?: string;
}

function buildHref(nextTags: string[], query?: string): string {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  for (const t of nextTags) params.append('tag', t);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default function TagBadge({ tag, selectedTags, currentQuery }: Props) {
  const isMultiSelect = selectedTags !== undefined;
  const active = isMultiSelect && selectedTags.includes(tag);

  const href = (() => {
    if (!isMultiSelect) {
      return buildHref([tag], currentQuery);
    }
    const next = active
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    return buildHref(next, currentQuery);
  })();

  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-blue-900 hover:text-blue-300'
      }`}
    >
      {tag}
    </Link>
  );
}
