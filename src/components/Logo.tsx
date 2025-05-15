import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo() {
  return (
    <Link href="/" className={cn(
        "text-3xl font-bold text-foreground hover:text-primary transition-colors",
        "text-glow-primary"
      )}>
      Melosa
    </Link>
  );
}
