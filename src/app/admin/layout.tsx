
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import { auth } from '@/lib/firebase'; // Import auth from firebase
import type { User } from 'firebase/auth';

// IMPORTANTE: Esta es una verificación de autenticación del lado del cliente.
// NO ES SEGURA para producción. Un usuario podría manipular localStorage.
// Para producción, usa Next.js Middleware para proteger rutas del lado del servidor.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

      if (!currentUser || !isAdminAuthenticated) {
        // Si no está autenticado y no está ya en la página de login, redirigir.
        if (pathname !== '/admin-login') {
          router.replace('/admin-login');
        } else {
          setIsLoading(false); // Si ya está en login, no hacer nada y permitir que se muestre.
        }
      } else {
        setIsLoading(false); // Autenticado, permitir acceso.
      }
    });

    // Limpiar la suscripción al desmontar
    return () => unsubscribe();
  }, [router, pathname]);

  // Si está cargando la verificación o si no es un usuario autenticado y ya está en admin-login,
  // no mostrar el layout de admin para evitar un flash de contenido.
  if (isLoading || (!user && pathname === '/admin-login')) {
    // Podrías mostrar un spinner de carga global aquí si lo deseas
    // Para admin-login, el propio layout de esa página se encargará.
    // Si no es admin-login y no está autenticado, ya fue redirigido.
    if (pathname !== '/admin-login') {
      return <div className="flex min-h-screen items-center justify-center"><p>Verificando acceso...</p></div>;
    }
    return null; // Para /admin-login, permite que esa página renderice su propio contenido completo.
  }
  
  // Si el usuario está autenticado pero intenta acceder a admin-login, redirigirlo al dashboard de admin
  if (user && localStorage.getItem('isAdminAuthenticated') === 'true' && pathname === '/admin-login') {
    router.replace('/admin');
    return <div className="flex min-h-screen items-center justify-center"><p>Redirigiendo...</p></div>;
  }


  // Si llegamos aquí, el usuario está autenticado (o debería estarlo para rutas /admin/*)
  // y no estamos en la página de login.
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8"> 
        {children}
      </div>
    </div>
  );
}
