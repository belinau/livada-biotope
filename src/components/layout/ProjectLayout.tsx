import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Typography, Box, Container, AppBar, Toolbar, Button, Grid, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none', ...style }}>
    {children}
  </Link>
);

interface ProjectLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({ 
  children, 
  title = 'Livada Biotope', 
  description = 'Urban biotope for climate resilience and biodiversity in Ljubljana, Slovenia'
}) => {
  const { t, language } = useLanguage();
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
                {language === 'en' ? 'Projects' : 'Projekti'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <StyledLink href="/projects/lets-not-dry-out-the-future" style={{ color: '#a7f3d0' }}>
                  {language === 'en' ? 'Let\'s Not Dry Out The Future' : 'Ne izsušimo prihodnosti'}
                </StyledLink>
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
  );
};

export default ProjectLayout;
