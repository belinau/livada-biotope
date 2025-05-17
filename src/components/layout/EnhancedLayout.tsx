import React from 'react';
import { Box, Container } from '@mui/material';
import Head from 'next/head';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function EnhancedLayout({ 
  children, 
  title = 'Livada Biotope',
  description = 'Sustainable living and community garden'
}: EnhancedLayoutProps) {
  return (
    <Box>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
