
import Link from 'next/link';
import Logo from './Logo'; 
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-foreground text-background shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild className="text-background hover:bg-primary hover:text-primary-foreground">
            <Link href="/">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Catálogo</span>
            </Link>
          </Button>
          {/* El enlace de Admin se ha eliminado. Los administradores navegarán a /admin-login directamente. */}
        </nav>
      </div>
    </header>
  );
}
