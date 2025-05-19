import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

// Define the theme options with proper TypeScript types
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32', // Green
      light: '#60AD5E',
      dark: '#005005',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#558B2F', // Light green
      light: '#85BB5C',
      dark: '#255D00',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
};

// This function should only be called on the client side
export function createClientTheme() {
  if (typeof window === 'undefined') {
    // Return a default theme for server-side rendering
    return createTheme({});
  }
  return createTheme(themeOptions);
}

// For backward compatibility
export const getTheme = createClientTheme;
