import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import StylizedImage from '../components/StylizedImage';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';

// Create a styled link component to avoid TypeScript errors
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    {children}
  </Link>
);

export default function Custom404() {
  const { language } = useLanguage();
  
  return (
    <>
      <Head>
        <title>404 - {language === 'en' ? 'Page Not Found' : 'Stran ni bila najdena'} | {language === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}</title>
        <meta name="description" content={language === 'en' ? "The page you are looking for does not exist or has been moved." : "Iskana stran ne obstaja ali je bila prestavljena."} />
      </Head>
      
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0.1, zIndex: 0 }}>
          <StylizedImage 
            speciesName={{
              en: "Common Daisy",
              sl: "Navadna marjetica"
            }}
            latinName="Bellis perennis"
            backgroundColor="#f8f5e6"
            patternColor="#2e7d32"
            pattern="dots"
            height="100%"
            width="100%"
          />
        </Box>
        
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" color="primary.dark" gutterBottom>
              404 - {language === 'en' ? 'Page Not Found' : 'Stran ni bila najdena'}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              {language === 'en' 
                ? 'The page you are looking for does not exist or has been moved.'
                : 'Iskana stran ne obstaja ali je bila prestavljena.'}
            </Typography>
            <StyledLink href="/">
              <Button variant="contained" color="primary" size="large">
                {language === 'en' ? 'Return to Home' : 'Nazaj na domačo stran'}
              </Button>
            </StyledLink>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
