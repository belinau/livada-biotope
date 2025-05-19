import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { locales, defaultLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Livada Biotope',
  description: 'Sustainable living and biodiversity conservation',
};

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Load messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider 
          locale={locale}
          messages={messages}
          timeZone="Europe/Ljubljana"
          onError={(error) => {
            console.error('Intl error:', error);
          }}
        >
          <ThemeRegistry options={{ key: 'mui' }}>
            {children}
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}