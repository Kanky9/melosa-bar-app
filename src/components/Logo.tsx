import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo() {
  return (
    <Link href="/" className={cn(
        "text-3xl font-bold text-primary hover:text-accent transition-colors",
        "text-shadow-subtle"
      )}>
      Melosa
    </Link>
  );
}
