import React, { ReactNode } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { lightTheme as theme } from "@/theme";
import Header from './Header';
import Footer from './Footer';

interface EnhancedLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  author?: string;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({
  children,
  title = 'Livada Biotope',
  description = 'Eco-feminist initiative developing land-based practices and promoting sustainable living.',
  keywords = ['ecofeminism', 'biodiversity', 'sustainability', 'Slovenia'],
  image = '/images/biodiversity-monitoring.jpg',
  type = 'website',
  author = 'Livada Biotope Team',
}) => {
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    {children}
  );
};

export default EnhancedLayout;
