
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
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
  const [user, setUser] = useState<User | null>(null); // To store Firebase auth user state
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true); // Ensure loading is true at the start of any potential auth check/redirect
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set user state from Firebase
      const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

      if (!currentUser || !isAdminAuthenticated) {
        // If not a Firebase authenticated user OR not marked as admin in localStorage,
        // redirect to the login page. AdminLayout is for protected routes.
        router.replace('/admin-login');
        // setIsLoading(false) is not strictly needed here as redirection will cause a new render cycle.
      } else {
        // User is authenticated via Firebase AND marked as admin in localStorage.
        if (pathname === '/admin' || pathname === '/admin/') {
          // If they are trying to access the base /admin or /admin/ path,
          // redirect them to a default admin page (e.g., categories).
          router.replace('/admin/categories');
        } else {
          // They are on a specific, valid admin page (e.g., /admin/products or /admin/categories).
          // Allow content to render.
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router, pathname]); // Dependencies for the effect

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('isAdminAuthenticated');
      toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
      router.push('/admin-login'); // Use push for logout for better browser history
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({ title: 'Error', description: 'No se pudo cerrar la sesión.', variant: 'destructive' });
    }
  };
  
  // While authentication and redirection logic is processing, show a loading state.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // If this point is reached, isLoading is false. This means:
  // 1. The user is authenticated (Firebase + localStorage).
  // 2. They are on a specific admin page (e.g., /admin/categories or /admin/products),
  //    not /admin or /admin/ (which would have been redirected).
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-auto items-center gap-4 border-b bg-background px-4 py-3 sm:px-6 md:py-4">
        <div className="flex items-center gap-2 mr-auto">
          {/* Replaced <Logo /> with static styled text for admin panel branding */}
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
