'use client';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { StrictCssBaseline } from '@/components/ui/StrictCssBaseline';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import createEmotionCache from '@/lib/createEmotionCache';
import { lightTheme as theme } from "@/theme";

const clientSideEmotionCache = createEmotionCache();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <StrictCssBaseline />
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}