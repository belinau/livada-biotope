import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();

  useEffect(() => {
    // Initialize language based on browser settings
    const userLang = navigator.language.split('-')[0];
    if (!router.locale) {
      router.push(router.pathname, router.asPath, { locale: userLang === 'sl' ? 'sl' : 'en' });
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
