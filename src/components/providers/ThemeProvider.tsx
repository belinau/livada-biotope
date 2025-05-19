'use client';

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme, getTheme } from '@/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(
    typeof window !== 'undefined' ? 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') :
    'light'
  );

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get the actual theme to use
  const theme = useMemo(() => {
    return getTheme(mode === 'system' ? systemTheme : mode);
  }, [mode, systemTheme]);

  // Check if current theme is dark
  const isDark = useMemo(() => {
    return (mode === 'system' ? systemTheme === 'dark' : mode === 'dark');
  }, [mode, systemTheme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'system') {
        return systemTheme === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  const contextValue = useMemo(() => ({
    mode,
    setMode,
    toggleTheme,
    isDark,
  }), [mode, isDark, systemTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
