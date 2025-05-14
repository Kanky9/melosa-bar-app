import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from GeistSans to Inter
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ // Changed from geistSans to inter
  variable: '--font-inter', // Defined CSS variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Melosa Bar App', // Updated title
  description: 'Online catalog and admin panel for Melosa Bar', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}> {/* Applied font variable to html tag */}
      <body className="font-sans antialiased flex flex-col min-h-screen"> {/* font-sans will now use Inter */}
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
