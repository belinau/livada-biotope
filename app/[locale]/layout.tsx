import { ReactNode, Suspense } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import CustomIntlProvider from '@/components/providers/CustomIntlProvider';
import { isLocale } from '@/i18n/config';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { notFound } from 'next/navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

interface LocaleLayoutProps {
  children: ReactNode;
  params: { 
    locale: string;
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Validate the locale
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider>
            <CustomIntlProvider locale={locale} messages={{}}>
              {children}
              {process.env.NODE_ENV === 'production' && <Analytics />}
              {process.env.NODE_ENV === 'production' && <SpeedInsights />}
            </CustomIntlProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sl' }];
}

export const dynamicParams = false;

export function generateMetadata() {
  return {
    title: {
      default: 'Livada Biotope',
      template: '%s | Livada Biotope',
    },
  };
}
