'use client';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
