
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Archive, Package, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin/categories', label: 'Categorías', icon: Archive },
  { href: '/admin/products', label: 'Productos', icon: Package },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

      if (!currentUser || !isAdminAuthenticated) {
        if (pathname !== '/admin-login') {
          router.replace('/admin-login');
        } else {
          setIsLoading(false); 
        }
      } else {
        // If authenticated and on /admin, redirect to /admin/categories
        if (pathname === '/admin') {
          router.replace('/admin/categories');
        } else if (pathname === '/admin-login') {
          // If authenticated and somehow on /admin-login, redirect to /admin/categories
          router.replace('/admin/categories');
        }
        else {
           setIsLoading(false); 
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('isAdminAuthenticated');
      toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
      router.push('/admin-login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({ title: 'Error', description: 'No se pudo cerrar la sesión.', variant: 'destructive' });
    }
  };
  
  // If loading, and not on admin-login, show loading.
  // If on admin-login, and not yet user, allow login to show (isLoading might be false here from auth check)
  if (isLoading && pathname !== '/admin-login') {
    return <div className="flex min-h-screen items-center justify-center"><p>Verificando acceso...</p></div>;
  }
  
  // If we're on admin-login and not authenticated (isLoading is false by now) let it render
  if (pathname === '/admin-login' && (!user || localStorage.getItem('isAdminAuthenticated') !== 'true')) {
    return <>{children}</>; // Render the login page
  }

  // If there's no user and we are NOT on the login page, it means redirection should have happened or is in progress.
  // Or, if we ARE on the login page BUT authenticated, redirection should happen.
  // This state is mostly a transition or error, show loading.
  if (!user && pathname !== '/admin-login') {
     return <div className="flex min-h-screen items-center justify-center"><p>Verificando acceso...</p></div>;
  }
   if (user && localStorage.getItem('isAdminAuthenticated') === 'true' && pathname === '/admin-login') {
    // This case should have been handled by useEffect, but as a fallback
    // router.replace('/admin/categories'); // This might cause infinite loop if useEffect is not fast enough
    return <div className="flex min-h-screen items-center justify-center"><p>Redirigiendo...</p></div>;
  }


  // If we are authenticated and on any admin page (not /admin-login), render the layout
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-auto items-center gap-4 border-b bg-background px-4 py-3 sm:px-6 md:py-4">
        <div className="flex items-center gap-2 mr-auto">
          <Logo /> <span className="font-semibold hidden sm:inline">Admin</span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          {adminNavItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname.startsWith(item.href) ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-9 rounded-md px-2 sm:px-3 text-xs sm:text-sm',
                 pathname.startsWith(item.href) ? '' : 'text-muted-foreground'
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline-block">{item.label}</span>
              </Link>
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={handleLogout} className="h-9 rounded-md px-2 sm:px-3 text-xs sm:text-sm">
            <LogOut className="h-3.5 w-3.5 sm:mr-2" />
            <span className="hidden sm:inline-block">Cerrar Sesión</span>
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
