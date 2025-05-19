import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import StylizedImage from '../components/StylizedImage';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';

// Create a styled link component to avoid TypeScript errors
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    {children}
  </Link>
);

export default function Custom500() {
  const { language } = useLanguage();
  
  return (
    <>
      <Head>
        <title>500 - {language === 'en' ? 'Server Error' : 'Napaka na strežniku'} | {language === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}</title>
        <meta name="description" content={language === 'en' ? "Sorry, something went wrong on our server. We're working to fix the issue." : "Oprostite, prišlo je do napake na našem strežniku. Delamo na odpravi težave."} />
      </Head>
      
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0.1, zIndex: 0 }}>
          <StylizedImage 
            speciesName={{
              en: "European Marsh Marigold",
              sl: "Močvirska kalužnica"
            }}
            latinName="Caltha palustris"
            backgroundColor="#f8f5e6"
            patternColor="#2e7d32"
            pattern="waves"
            height="100%"
            width="100%"
          />
        </Box>
        
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" color="primary.dark" gutterBottom>
              500 - {language === 'en' ? 'Server Error' : 'Napaka na strežniku'}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              {language === 'en' 
                ? 'Sorry, something went wrong on our server. We\'re working to fix the issue.'
                : 'Oprostite, prišlo je do napake na našem strežniku. Delamo na odpravi težave.'}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.location.reload()}
                size="large"
              >
                {language === 'en' ? 'Try Again' : 'Poskusi znova'}
              </Button>
              <StyledLink href="/">
                <Button variant="outlined" color="primary" size="large">
                  {language === 'en' ? 'Return to Home' : 'Nazaj na domačo stran'}
                </Button>
              </StyledLink>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
