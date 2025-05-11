import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '../contexts/LanguageContext';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SharedLayout from '../components/layout/SharedLayout';

// Define the theme for the entire application
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep forest green
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#d84315', // Warm terracotta
      light: '#ff7543',
      dark: '#9f0000',
    },
    background: {
      default: '#f8f5e6', // Light cream background
    },
  },
  typography: {
    fontFamily: '"Lora", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  // Check if the Component has a getLayout function
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => <SharedLayout>{page}</SharedLayout>);

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
