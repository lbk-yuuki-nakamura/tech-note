import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-100 hover:text-blue-400">
          Tech Note
        </Link>
        <nav className="flex gap-4 text-sm text-slate-400">
          <Link href="/" className="hover:text-slate-100">記事一覧</Link>
        </nav>
      </div>
    </header>
  );
}
