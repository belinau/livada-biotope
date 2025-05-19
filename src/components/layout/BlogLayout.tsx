import React, { ReactNode } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { lightTheme as theme } from "@/theme";
import Header from './Header';
import Footer from './Footer';

interface BlogLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  author?: string;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  title = 'Blog - Livada Biotope',
  description = 'Read our latest articles on regenerative agriculture, biodiversity, and sustainable living.',
  keywords = ['blog', 'regenerative agriculture', 'sustainability', 'biodiversity', 'permaculture'],
  image = '/images/biodiversity-monitoring.jpg',
  type = 'website',
  author = 'Livada Biotope Team',
}) => {
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    {children}
  );
};

export default BlogLayout;
