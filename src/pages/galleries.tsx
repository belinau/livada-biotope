import React from 'react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Layout from '../components/layout/Layout';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import useTranslations from '../hooks/useTranslations';

interface GalleryData {
  slug: string;
  title_en: string;
  title_sl: string;
  description_en: string;
  description_sl: string;
  date: string;
  gallery: {
    image: string;
    caption: string;
    alt: string;
  }[];
}

interface GalleriesProps {
  galleries: GalleryData[];
}

export default function Galleries({ galleries }: GalleriesProps) {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const getLangContent = (enContent: string, slContent: string) => {
    return language === 'en' ? enContent : slContent;
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          {t('Navbar.galleries')}
        </Typography>
        
        <Box mt={6}>
          <Grid container spacing={4}>
            {galleries.map((gallery) => (
              <Grid item xs={12} sm={6} md={4} key={gallery.slug}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    } 
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={gallery.gallery && gallery.gallery.length > 0 ? gallery.gallery[0].image : '/images/placeholder.jpg'}
                    alt={gallery.gallery && gallery.gallery.length > 0 ? gallery.gallery[0].alt : 'Gallery thumbnail'}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {getLangContent(gallery.title_en, gallery.title_sl)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {getLangContent(gallery.description_en, gallery.description_sl)}
                    </Typography>
                    <Button 
                      component={Link} 
                      href={`/galleries/${gallery.slug}`}
                      variant="contained" 
                      color="primary"
                      fullWidth
                    >
                      {language === 'en' ? 'View Gallery' : 'Oglej si galerijo'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {galleries.length === 0 && (
            <Box textAlign="center" mt={4} p={4} bgcolor="background.paper" borderRadius={2}>
              <Typography variant="h6" color="text.secondary">
                {language === 'en' ? 'No galleries found.' : 'Ni najdenih galerij.'}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const galleriesDirectory = path.join(process.cwd(), 'src/content/galleries');
  
  // Check if directory exists
  if (!fs.existsSync(galleriesDirectory)) {
    return {
      props: {
        galleries: []
      }
    };
  }
  
  const fileNames = fs.readdirSync(galleriesDirectory);
  const galleries = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const filePath = path.join(galleriesDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        ...data
      };
    });

  // Sort galleries by date (newest first)
  galleries.sort((a: any, b: any) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  return {
    props: {
      galleries
    }
  };
};
