import React from 'react';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import dynamic from 'next/dynamic';

// Use dynamic imports for components that might not be immediately available
const Header = dynamic(() => import('@/components/common/Header'), { 
  ssr: false,
  loading: () => <div>Loading header...</div> 
});

const Footer = dynamic(() => import('@/components/common/Footer'), { 
  ssr: false,
  loading: () => <div>Loading footer...</div> 
});

interface BlogLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function BlogLayout({
  children,
  title = 'Blog - Livada Biotope',
  description = 'Thoughts on sustainable living, permaculture, and community building'
}: BlogLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      
      {React.createElement(Header, {})}
      
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      
      {React.createElement(Footer, {})}
    </Box>
  );
}
