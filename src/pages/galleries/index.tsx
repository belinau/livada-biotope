import React from 'react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Container, Typography, Box, Card, CardContent, CardMedia } from '@mui/material';
import Grid from '@/components/ui/Grid'; // Using our custom Grid component
import SharedLayout from '@/components/layout/SharedLayout';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';


interface GalleryImage {
  image: string;
  caption?: string;
  alt?: string;
}

interface Gallery {
  slug: string;
  title: string;
  description: string;
  date: string;
  gallery: GalleryImage[];
}

interface GalleriesPageProps {
  galleries: Gallery[];
}

export default function GalleriesPage({ galleries }: GalleriesPageProps) {
  const { language } = useLanguage();


  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" sx={{ 
          color: 'primary.main', 
          mb: 2,
          fontWeight: 700 
        }}>
          {language === 'en' ? 'Photo Galleries' : 'Foto Galerije'}
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          {language === 'en' 
            ? 'Explore our visual journey through images' 
            : 'Raziskujte našo vizualno pot skozi slike'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {galleries.map((gallery) => (
          <Grid item xs={12} sm={6} md={4} key={gallery.slug} component="div">
            <Link href={`/galleries/${gallery.slug}`} style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    position: 'relative',
                    height: 240,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${gallery.gallery[0]?.image || '/images/placeholder.jpg'})`,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {gallery.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(gallery.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sl-SI', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {gallery.description.length > 120 
                      ? gallery.description.substring(0, 120) + '...' 
                      : gallery.description}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {gallery.gallery.length} {language === 'en' ? 'photos' : 'fotografij'}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}

        {galleries.length === 0 && (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {language === 'en' 
                ? 'No galleries found. Create your first gallery in the CMS!' 
                : 'Ni najdenih galerij. Ustvarite svojo prvo galerijo v CMS!'}
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const galleriesDirectory = path.join(process.cwd(), 'src/content/galleries');
  
  // Check if directory exists, if not, return empty array
  if (!fs.existsSync(galleriesDirectory)) {
    return {
      props: {
        galleries: [],
      },
    };
  }
  
  const filenames = fs.readdirSync(galleriesDirectory);
  
  const galleries = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(galleriesDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: filename.replace('.md', ''),
        title: data.title || '',
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    props: {
      galleries,
    },
  };
};

// Define a custom layout for this page
GalleriesPage.getLayout = function getLayout(page: React.ReactNode) {
  return <SharedLayout>{page}</SharedLayout>;
};
