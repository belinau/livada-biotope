import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink } from '@mui/material';
import SharedLayout from '@/components/layout/SharedLayout';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

import PhotoGallery, { GalleryImage } from '@/components/features/PhotoGallery';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';

interface GalleryPageProps {
  gallery: {
    title_en: string;
    title_sl: string;
    description_en: string;
    description_sl: string;
    date: string;
    gallery: GalleryImage[];
  };
}

export default function GalleryPage({ gallery }: GalleryPageProps) {
  const { language } = useLanguage();

  if (!gallery) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" color="error" align="center">
          {language === 'en' ? 'Gallery not found' : 'Galerija ni najdena'}
        </Typography>
      </Container>
    );
  }

  // Get the appropriate content based on the current language
  const title = language === 'en' ? gallery.title_en : gallery.title_sl;
  const description = language === 'en' ? gallery.description_en : gallery.description_sl;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
        <Link href="/" passHref>
          <MuiLink 
            sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', textDecoration: 'none' }}
            color="inherit"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            {language === 'en' ? 'Home' : 'Domov'}
          </MuiLink>
        </Link>
        <Link href="/galleries" passHref>
          <MuiLink
            sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', textDecoration: 'none' }}
            color="inherit"
          >
            <CollectionsIcon sx={{ mr: 0.5 }} fontSize="small" />
            {language === 'en' ? 'Galleries' : 'Galerije'}
          </MuiLink>
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          {title}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ 
          color: 'primary.main', 
          mb: 2,
          fontWeight: 700 
        }}>
          {title}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
          {new Date(gallery.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sl-SI', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Box>

      <PhotoGallery 
        description={description}
        images={gallery.gallery}
      />
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const galleriesDirectory = path.join(process.cwd(), 'src/content/galleries');
  
  // Check if directory exists, if not, return empty array
  if (!fs.existsSync(galleriesDirectory)) {
    return {
      paths: [],
      fallback: false,
    };
  }
  
  const filenames = fs.readdirSync(galleriesDirectory);
  
  const paths = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => ({
      params: {
        slug: filename.replace('.md', ''),
      },
    }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const galleriesDirectory = path.join(process.cwd(), 'src/content/galleries');
  const filePath = path.join(galleriesDirectory, `${slug}.md`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return {
      notFound: true,
    };
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return {
    props: {
      gallery: {
        title_en: data.title_en || '',
        title_sl: data.title_sl || '',
        description_en: data.description_en || '',
        description_sl: data.description_sl || '',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
      },
    },
  };
};

// Define a custom layout for this page
GalleryPage.getLayout = function getLayout(page: React.ReactNode) {
  return <SharedLayout>{page}</SharedLayout>;
};
