
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
// Logo component is no longer imported here directly for the header display
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
        if (pathname === '/admin' || pathname === '/admin/') {
          router.replace('/admin/categories');
        } else if (pathname === '/admin-login') {
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
  
  if (isLoading && pathname !== '/admin-login') {
    return <div className="flex min-h-screen items-center justify-center"><p>Verificando acceso...</p></div>;
  }
  
  if (pathname === '/admin-login' && (!user || localStorage.getItem('isAdminAuthenticated') !== 'true')) {
    return <>{children}</>; 
  }

  if (!user && pathname !== '/admin-login') {
     return <div className="flex min-h-screen items-center justify-center"><p>Verificando acceso...</p></div>;
  }
   if (user && localStorage.getItem('isAdminAuthenticated') === 'true' && pathname === '/admin-login') {
    return <div className="flex min-h-screen items-center justify-center"><p>Redirigiendo...</p></div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-auto items-center gap-4 border-b bg-background px-4 py-3 sm:px-6 md:py-4">
        <div className="flex items-center gap-2 mr-auto">
          {/* Replaced <Logo /> with static styled text */}
          <div className={cn(
            "text-3xl font-bold text-primary",
            "text-glow-primary" // Assuming text-glow-primary is defined in globals.css
          )}>
            Melosa
          </div>
          <span className="font-semibold text-xl text-foreground hidden sm:inline">Admin</span>
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
