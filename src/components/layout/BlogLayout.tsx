import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Head from 'next/head';
import Link from 'next/link';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { 
  Box, 
  Container, 
  CssBaseline,
  Typography,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Grid,
  Paper
} from '@mui/material';

interface BlogLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

// Create a theme instance that matches the global theme
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
        },
      },
    },
  },
});

export default function BlogLayout({ children, title, description }: BlogLayoutProps) {
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = [
    { href: '/', title: t('Navbar.home') },
    { href: '/projects', title: t('Navbar.projects') },
    { href: '/biodiversity', title: t('Navbar.biodiversity') },
    { href: '/instructables', title: t('Navbar.instructables') },
    { href: '/ecofeminism', title: t('Navbar.ecofeminism') },
    { href: '/events', title: language === 'en' ? 'Events' : 'Dogodki' },
    { href: '/about', title: t('Navbar.about') },
    { href: '/contact', title: t('Navbar.contact') },
    { href: '/blog', title: t('Navbar.blog') }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Head>
          <title>{title || 'Blog - Livada Biotope'}</title>
          <meta name="description" content={description || 'Explore our blog for insights on urban biodiversity and climate resilience'} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <CssBaseline />

        {/* Background pattern */}
        <Box sx={{ 
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.05
        }}>
          <Box sx={{ 
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, #f0fdf4, #e0f2fe)'
          }} />
          <Box sx={{ 
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/images/pattern-leaves.svg")',
            backgroundSize: '500px',
            backgroundRepeat: 'repeat',
            opacity: 0.15
          }} />
        </Box>

        {/* Header */}
        <AppBar position="sticky" sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: 1
        }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/images/livada-bio-logo-new.svg" alt="livada.bio" width="150" height="40" />
                </Link>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                  {menuItems.map((item) => (
                    <Button
                      key={item.href}
                      component={Link}
                      href={item.href}
                      sx={{ 
                        color: 'text.primary',
                        mx: 1,
                        '&:hover': { color: 'primary.main' },
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LanguageSwitcher />
                <IconButton
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                  color="inherit"
                  aria-label="Open menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <svg style={{ height: '24px', width: '24px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 10, py: 4 }}>
          <Container maxWidth="lg">
            <main>
              {children}
            </main>
          </Container>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ 
          backgroundColor: '#1b5e20', 
          color: 'white',
          mt: 'auto',
          py: 6
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {language === 'en' ? 'About Us' : 'O nas'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {language === 'en' 
                    ? 'Urban biotope for climate resilience and biodiversity in Ljubljana, Slovenia.' 
                    : 'Urbani biotop za podnebno odpornost in biotsko raznovrstnost v Ljubljani, Slovenija.'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {language === 'en' ? 'Contact' : 'Kontakt'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  info@livada.bio
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Ljubljana, Slovenia
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {language === 'en' ? 'Social' : 'Družbena omrežja'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <a 
                    href="https://www.inaturalist.org/projects/the-livada-biotope-monitoring" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#a7f3d0', textDecoration: 'none' }}
                  >
                    iNaturalist
                  </a>
                  <a 
                    href="https://bsky.app/profile/livada-bio.bsky.social" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#a7f3d0', textDecoration: 'none' }}
                  >
                    Bluesky
                  </a>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {new Date().getFullYear()} Livada Biotope. {language === 'en' ? 'All rights reserved.' : 'Vse pravice pridržane.'}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
