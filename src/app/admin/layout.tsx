
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import { auth } from '@/lib/firebase'; 
import type { User } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from 'next/link'; // Import Link for mobile header logo/title
import Logo from '@/components/Logo'; // Import Logo if you want to use it in mobile header


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        setIsLoading(false); 
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (isLoading || (!user && pathname === '/admin-login')) {
    if (pathname !== '/admin-login') {
      return <div className="flex min-h-screen items-center justify-center"><p>Verificando acceso...</p></div>;
    }
    return null; 
  }
  
  if (user && localStorage.getItem('isAdminAuthenticated') === 'true' && pathname === '/admin-login') {
    router.replace('/admin');
    return <div className="flex min-h-screen items-center justify-center"><p>Redirigiendo...</p></div>;
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar: Fixed and always visible */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30 w-64 border-r bg-sidebar">
        <AdminSidebar />
      </div>

      {/* Mobile Header: Fixed with Menu button for Sheet */}
      <header className="md:hidden flex items-center justify-between p-4 bg-card border-b fixed top-0 left-0 right-0 h-16 z-40 shadow-sm">
        <Link href="/admin" className="text-xl font-bold text-primary" onClick={() => setIsSheetOpen(false)}>
           Melosa
        </Link>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Abrir menú">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-sidebar w-3/4 max-w-xs" aria-describedby={undefined} title={undefined}>
            {/* AdminSidebar content will be rendered here. Its internal padding will apply. */}
            <AdminSidebar onClose={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content Area */}
      {/* pt-20 (h-16 header + p-4 equivalent) for mobile to account for fixed header */}
      {/* md:pt-8 for desktop default padding */}
      {/* ml-0 for mobile, md:ml-64 for desktop to make space for fixed sidebar */}
      <main className="flex-1 p-6 pt-20 md:pt-8 md:ml-64"> 
        {children}
      </main>
    </div>
  );
}
