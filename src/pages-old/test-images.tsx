import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Grid } from '@mui/material';
import TestImage from '../components/TestImage';
import StylizedImage from '../components/StylizedImage';
import SharedLayout from '@/components/layout/SharedLayout';

export default function TestImagesPage() {
  // Array of test images to verify - using only project images
  const testImages = [
    { src: '/images/fritillaria.jpg', alt: 'Fritillaria' },
    { src: '/images/more-than-human.jpg', alt: 'More Than Human' },
    { src: '/images/biodiversity-monitoring.jpg', alt: 'Biodiversity Monitoring' },
    { src: '/images/uploads/pxl_20250427_173714623.jpg', alt: 'Field Activity 1' },
    { src: '/images/uploads/pxl_20250427_173829850.jpg', alt: 'Field Activity 2' }
  ];

  return (
    <SharedLayout>
      <Head>
        <title>Image Test Page | Livada Biotope</title>
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
          Image Test Page
        </Typography>
        
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Regular Images
        </Typography>
        
        <Grid container spacing={3}>
          {testImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TestImage 
                src={image.src} 
                alt={image.alt} 
              />
            </Grid>
          ))}
        </Grid>
        
        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 2 }}>
          StylizedImage Component Test
        </Typography>
        
        <Grid container spacing={3}>
          {testImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={`stylized-${index}`}>
              <Box sx={{ height: 250, position: 'relative' }}>
                <StylizedImage
                  speciesName={{
                    en: image.alt,
                    sl: image.alt
                  }}
                  latinName=""
                  backgroundColor="#f8f5e6"
                  patternColor={index % 2 === 0 ? "#2e7d32" : "#d84315"}
                  pattern={index % 2 === 0 ? "dots" : "waves"}
                  height="100%"
                  width="100%"
                  imageSrc={image.src}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </SharedLayout>
  );
}

TestImagesPage.getLayout = function getLayout(page: React.ReactElement) {
  return <SharedLayout>{page}</SharedLayout>;
};
