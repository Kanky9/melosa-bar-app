
'use client';

import Link from 'next/link';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Home, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for Admin
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Import Firebase auth

export default function Header() {
  const router = useRouter();

  const handleAdminClick = () => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    const currentUser = auth.currentUser;

    if (isAdminAuthenticated && currentUser) {
      router.push('/admin');
    } else {
      router.push('/admin-login');
    }
  };

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
          <Button 
            variant="ghost" 
            onClick={handleAdminClick} 
            className="text-background hover:bg-primary hover:text-primary-foreground"
            aria-label="Panel de Administración"
          >
            <ShieldCheck className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Admin</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
