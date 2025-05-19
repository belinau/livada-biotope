import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { lightTheme as theme } from "@/theme";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box, Container } from '@mui/material';

type Locale = 'en' | 'sl';

interface MainLayoutProps {
  children: ReactNode;
  params: {
    locale: Locale;
  };
}

export default function MainLayout({ children, params: { locale } }: MainLayoutProps) {
  return (
    <LanguageProvider initialLocale={locale}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export const metadata = {
  title: 'Livada Biotope',
  description: 'Eco-feminist initiative developing land-based practices and promoting sustainable living.',
};

// Enable static params for static generation of all locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sl' }];
}
