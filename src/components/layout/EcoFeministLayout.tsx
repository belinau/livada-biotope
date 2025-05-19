import React, { ReactNode } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { lightTheme as theme } from "@/theme";
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
    {children}
  );
};

export default EcoFeministLayout;
