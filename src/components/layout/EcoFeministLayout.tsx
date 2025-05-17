import React, { ReactNode } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import theme from '@/styles/theme';
import Header from './Header';
import Footer from './Footer';

interface EcoFeministLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  author?: string;
}

const EcoFeministLayout: React.FC<EcoFeministLayoutProps> = ({
  children,
  title = 'Eco-Feminist Initiative - Livada Biotope',
  description = 'Exploring the intersection of ecology and feminism through sustainable practices.',
  keywords = ['ecofeminism', 'sustainability', 'gender equality', 'environment'],
  image = '/images/ecofeminism.jpg',
  type = 'website',
  author = 'Livada Biotope Team',
}) => {
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="author" content={author} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content={type} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default EcoFeministLayout;
