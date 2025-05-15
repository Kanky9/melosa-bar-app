
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Archive, Package, LayoutGrid, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/categories', label: 'Categorías', icon: Archive },
  { href: '/admin/products', label: 'Productos', icon: Package },
];

interface AdminSidebarProps {
  onClose?: () => void; // Prop para cerrar el panel en móvil
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('isAdminAuthenticated');
      toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
      if (onClose) {
        onClose();
      }
      router.push('/admin-login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({ title: 'Error', description: 'No se pudo cerrar la sesión.', variant: 'destructive' });
    }
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground p-6 flex flex-col space-y-6 shadow-lg h-full">
      <div className="text-center mb-4">
        <Logo />
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-base h-12',
                  pathname === item.href
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
                asChild
                onClick={handleNavigation}
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto space-y-3">
        <Button
            variant="ghost"
            className="w-full justify-start text-base h-12 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
        >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
        </Button>
        <div className="text-center text-xs text-sidebar-foreground/70">
          Melosa Admin Panel
        </div>
      </div>
    </aside>
  );
}
