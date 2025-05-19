'use client';

import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material';

export function StrictCssBaseline() {
  const theme = useTheme();
  
  return (
    <MuiGlobalStyles
      styles={{
        // Keep the base styles but make them SSR-safe
        ':root': {
          colorScheme: theme.palette.mode,
        },
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          // Change from :first-child to :first-of-type
          '&:first-of-type': {
            WebkitTextSizeAdjust: '100%',
          },
        },
        body: {
          margin: 0,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          // Change from :first-child to :first-of-type
          '&:first-of-type': {
            minHeight: '100vh',
            minHeight: '100dvh',
          },
        },
      }}
    />
  );
}