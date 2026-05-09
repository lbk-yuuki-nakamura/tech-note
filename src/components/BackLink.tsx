'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  className?: string;
  children: React.ReactNode;
  testId?: string;
}

export default function BackLink({ className, children, testId }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const stored = sessionStorage.getItem('tn:lastList');
    if (!stored) return;
    e.preventDefault();
    router.push(stored);
  };

  return (
    <Link href="/" onClick={handleClick} className={className} data-testid={testId}>
      {children}
    </Link>
  );
}
