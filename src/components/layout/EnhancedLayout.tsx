import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from '../../contexts/LanguageContext';
import useTranslations from '../../hooks/useTranslations';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Typography, Box, Container, AppBar, Toolbar, Button, Grid, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none', ...style }}>
    {children}
  </Link>
);

interface EnhancedLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ 
  children, 
  title = 'Livada Biotope', 
  description = 'Urban biotope for climate resilience and biodiversity in Ljubljana, Slovenia'
}) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = [
    { href: '/', title: t('Navbar.home') },
    { href: '/projects', title: t('Navbar.projects') },
    { href: '/biodiversity', title: t('Navbar.biodiversity') },
    { href: '/instructables', title: t('Navbar.instructables') },
    { href: '/ecofeminism', title: t('Navbar.ecofeminism') },
    { href: '/about', title: t('Navbar.about') },
    { href: '/contact', title: t('Navbar.contact') },
    { href: '/blog', title: t('Navbar.blog') }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
                <a 
                  href="https://www.inaturalist.org/projects/the-livada-biotope-monitoring" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#6b7280', transition: 'color 0.2s' }}
                  aria-label="iNaturalist"
                >
                  <svg style={{ height: '20px', width: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                    <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                  </svg>
                </a>
                <a 
                  href="https://bsky.app/profile/livada-bio.bsky.social" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#6b7280', transition: 'color 0.2s' }}
                  aria-label="Bluesky"
                >
                  <svg style={{ height: '20px', width: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                    <path d="M12.5 7.5a1 1 0 1 0-2 0v4.6L8.3 9.8a1 1 0 0 0-1.4 1.4l3.5 3.5a1 1 0 0 0 1.4 0l3.5-3.5a1 1 0 0 0-1.4-1.4l-1.4 1.4V7.5z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/livada-bio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#6b7280', transition: 'color 0.2s' }}
                  aria-label="GitHub"
                >
                  <svg style={{ height: '20px', width: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              </Box>
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
      <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 10 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: 'primary.dark', 
        color: 'white', 
        py: 4, 
        position: 'relative',
        zIndex: 10 
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Livada Biotope</Typography>
              <Typography variant="body2" sx={{ color: '#a7f3d0' }}>Ljubljana, Slovenia</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {language === 'en' ? 'Contact' : 'Kontakt'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#a7f3d0' }}>info@livada-biotope.si</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
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
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {language === 'en' ? 'Partners' : 'Partnerji'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#a7f3d0' }}>BOB Institute</Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'primary.main', color: '#a7f3d0', fontSize: '0.875rem' }}>
            <Typography variant="body2">&copy; {new Date().getFullYear()} Livada Biotope. {language === 'en' ? 'All rights reserved.' : 'Vse pravice pridržane.'}</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default EnhancedLayout;
