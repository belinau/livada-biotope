import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '@/lib/createEmotionCache';
import { lightTheme as theme } from "@/theme";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <LanguageProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
