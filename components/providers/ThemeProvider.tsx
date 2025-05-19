'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '@/styles/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
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

export function ThemeProvider({ 
  children, 
  defaultMode = 'system' 
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
    if (mode === 'system') {
      return systemTheme === 'dark' ? darkTheme : lightTheme;
    }
    return mode === 'dark' ? darkTheme : lightTheme;
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

  // Persist theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
