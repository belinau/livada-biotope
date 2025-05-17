import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton,
  ThemeProvider,
  createTheme,
  Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useTranslations from '@/hooks/useTranslations';

// Create a theme instance with ecofeminist colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#9c27b0',
      light: '#d05ce3',
      dark: '#6a0080',
    },
    background: {
      default: '#f8f5e6',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
  },
});

interface EcoFeministLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function EcoFeministLayout({
  children,
  title = 'Ecofeminism - Livada Biotope',
  description = 'Exploring the intersection of ecology and feminism in Ljubljana, Slovenia',
}: EcoFeministLayoutProps) {
  const { t } = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary">
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { sm: 'none' } }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/ecofeminism" passHref>
                  <Box component="a" sx={{ color: 'inherit', textDecoration: 'none' }}>
                    Livada Biotope
                  </Box>
                </Link>
              </Typography>
              
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Button color="inherit" href="/ecofeminism">
                  {t('common.home')}
                </Button>
                <Button color="inherit" href="/ecofeminism/about">
                  {t('common.about')}
                </Button>
                <Button color="inherit" href="/ecofeminism/events">
                  {t('common.events')}
                </Button>
                <Button color="inherit" href="/ecofeminism/contact">
                  {t('common.contact')}
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          {children}
        </Container>
        
        <Box component="footer" sx={{ py: 3, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>
                  Livada Biotope
                </Typography>
                <Typography variant="body2">
                  {t('common.sustainableLiving')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>
                  {t('common.links')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Link href="/ecofeminism/privacy" passHref>
                    <Button color="inherit">{t('common.privacy')}</Button>
                  </Link>
                  <Link href="/ecofeminism/terms" passHref>
                    <Button color="inherit">{t('common.terms')}</Button>
                  </Link>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>
                  {t('common.contactUs')}
                </Typography>
                <Typography variant="body2">
                  Email: info@livadabiotope.si
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              &copy; {new Date().getFullYear()} Livada Biotope. {t('common.allRightsReserved')}.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
