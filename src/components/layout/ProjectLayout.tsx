import React, { ReactNode } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { lightTheme as theme } from "@/theme";
import Header from './Header';
import Footer from './Footer';

interface ProjectLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  author?: string;
}

const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  children,
  title = 'Project - Livada Biotope',
  description = 'Explore our projects on regenerative agriculture and biodiversity conservation.',
  keywords = ['project', 'regenerative agriculture', 'sustainability', 'biodiversity'],
  image = '/images/biodiversity-monitoring.jpg',
  type = 'website',
  author = 'Livada Biotope Team',
}) => {
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    {children}
  );
};

export default ProjectLayout;
