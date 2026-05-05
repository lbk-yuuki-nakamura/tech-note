import Link from 'next/link';

interface Props {
  tag: string;
  active?: boolean;
  currentQuery?: string;
}

export default function TagBadge({ tag, active = false, currentQuery }: Props) {
  const buildHref = () => {
    if (active) {
      return currentQuery ? `/?q=${encodeURIComponent(currentQuery)}` : '/';
    }
    const params = new URLSearchParams();
    params.set('tag', tag);
    if (currentQuery) params.set('q', currentQuery);
    return `/?${params.toString()}`;
  };

  return (
    <Link
      href={buildHref()}
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
