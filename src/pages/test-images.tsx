import React from 'react';
import Head from 'next/head';
import { Container, Typography, Grid, Box } from '@mui/material';
import TestImage from '../components/TestImage';
import StylizedImage from '../components/StylizedImage';
import SharedLayout from '@/components/layout/SharedLayout';

export default function TestImagesPage() {
  // Array of test images to verify
  const testImages = [
    { src: '/images/fritillaria.jpg', alt: 'Fritillaria' },
    { src: '/images/more-than-human.jpg', alt: 'More Than Human' },
    { src: '/images/biodiversity-monitoring.jpg', alt: 'Biodiversity Monitoring' },
    { src: '/images/illustrations/botanical-1.jpg', alt: 'Botanical 1' },
    { src: '/images/illustrations/botanical-2.jpg', alt: 'Botanical 2' },
    { src: '/images/illustrations/zoological-1.jpg', alt: 'Zoological 1' },
    { src: '/images/illustrations/zoological-2.jpg', alt: 'Zoological 2' }
  ];

  return (
    <>
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
            <Grid item xs={12} sm={6} md={4} key={`styled-${index}`}>
              <Box sx={{ height: 200, mb: 2 }}>
                <StylizedImage 
                  speciesName={{
                    en: image.alt,
                    sl: image.alt
                  }}
                  latinName="Test Image"
                  backgroundColor="#f8f5e6"
                  patternColor="#2e7d32"
                  pattern={index % 4 === 0 ? "dots" : index % 4 === 1 ? "lines" : index % 4 === 2 ? "waves" : "leaves"}
                  height="100%"
                  width="100%"
                  imageSrc={image.src}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

TestImagesPage.getLayout = (page: React.ReactElement) => {
  return <SharedLayout>{page}</SharedLayout>;
};
