import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { lightTheme } from "@/theme";
import { defaultLocale, isLocale, locales } from '@/config/i18n';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Livada Biotope',
  description: 'Eco-feminist initiative developing land-based practices and promoting sustainable living.',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Helper function to get messages
async function getMessages(locale: string): Promise<AbstractIntlMessages> {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!isLocale(locale)) notFound();

  // Fetch messages for the current locale
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <ThemeRegistry options={{ key: 'mui' }}>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Europe/Bucharest"
          >
            <MuiThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                }}
              >
                {children}
              </Box>
            </MuiThemeProvider>
          </NextIntlClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

// Set the revalidation time (in seconds)
export const revalidate = 3600; // Revalidate every hour
