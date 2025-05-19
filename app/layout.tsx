import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Livada Biotop',
  description: 'Sustainable living and permaculture in Ljubljana',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // This layout is only used for the root path
  // Redirect to the default locale
  redirect(`/${defaultLocale}`);
}

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sl' }];
}
