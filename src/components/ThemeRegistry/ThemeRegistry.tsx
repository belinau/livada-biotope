'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { NextAppDirEmotionCacheProvider } from './EmotionCache';
import { lightTheme } from '@/theme';

interface ThemeRegistryProps {
  children: React.ReactNode;
  options: {
    key: string;
  };
}

export default function ThemeRegistry({ children, options }: ThemeRegistryProps) {
  return (
    <NextAppDirEmotionCacheProvider options={options}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
