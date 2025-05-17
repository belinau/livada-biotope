import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useLanguage } from '../../contexts/LanguageContext';
import useTranslations from '../../hooks/useTranslations';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { 
  Box, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  Divider, 
  Button,
  ThemeProvider,
  createTheme,
  Grid as MuiGrid
} from '@mui/material';

// Create a styled Grid component that includes the container prop
const Grid = MuiGrid;

// Create a theme instance
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
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
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

interface SharedLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ 
  children,
  title = 'Livada Biotope',
  description = 'Urban biotope for climate resilience and biodiversity in Ljubljana, Slovenia'
}) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/', title: t('nav.home', 'Home') },
    { href: '/projects', title: t('nav.projects', 'Projects') },
    { href: '/biodiversity', title: t('Navbar.biodiversity', 'Biodiversity') },
    { href: '/instructables', title: t('Navbar.instructables', 'Instructables') },
    { href: '/ecofeminism', title: t('Navbar.ecofeminism', 'Ecofeminism') },
    { href: '/events', title: t('nav.events', 'Events') },
    { href: '/contact', title: t('nav.contact', 'Contact') },
    { href: '/blog', title: t('Navbar.blog', 'Blog') }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

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
                  <Image src="/images/livada-bio-logo-new.svg" alt="livada.bio" width={150} height={40} />
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

        {/* Mobile menu drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: '80%', maxWidth: '300px' } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image src="/images/livada-bio-logo-new.svg" alt="livada.bio" width={120} height={32} />
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton 
                  component={Link} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 10, py: 4 }}>
          <Container maxWidth="lg">
            {children}
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
                &copy; {new Date().getFullYear()} Livada Biotope. {language === 'en' ? 'All rights reserved.' : 'Vse pravice pridržane.'}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SharedLayout;
