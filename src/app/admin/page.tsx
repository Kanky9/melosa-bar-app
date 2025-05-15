
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page component handles the base /admin route.
// Its primary purpose is to redirect to a default admin section, e.g., /admin/categories.
// The AdminLayout ensures that this page is only reached if the user is authenticated.
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default admin section.
    // This happens after AdminLayout has confirmed authentication.
    router.replace('/admin/categories');
  }, [router]);

  // Optionally, render a loading/redirecting message, though it might not be visible for long.
  return (
    <div className="flex min-h-full items-center justify-center">
      <p>Redirigiendo al panel de administración...</p>
    </div>
  );
}
