'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { HomePageData } from '@/types/home';
import { Box, Button, Container, Typography, Grid, Card, CardContent, CardActions, Paper } from '@mui/material';

interface HomePageProps {
  data: HomePageData;
}

export default function HomePage({ data }: HomePageProps) {
  const { locale } = useLanguage();
  const getContent = (en: string, sl: string) => (locale === 'en' ? en : sl);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '80vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 1
          }
        }}
      >
        {/* Hero Image */}
        {data.hero_image && (
          <Box sx={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%',
            zIndex: 0
          }}>
            <Image
              src={data.hero_image}
              alt={getContent(data.title_en, data.title_sl)}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              priority
            />
          </Box>
        )}
        
        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 3 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2
            }}
          >
            {getContent(data.hero_text_en, data.hero_text_sl)}
          </Typography>
          
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 400,
              mb: 4,
              fontStyle: 'italic'
            }}
          >
            {getContent(data.subtitle_en, data.subtitle_sl)}
          </Typography>
          
          <Button 
            component={Link}
            href={`/${locale}/about`}
            variant="contained" 
            color="primary" 
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
            }}
          >
            {locale === 'en' ? 'Learn More' : 'Več o nas'}
          </Button>
        </Container>
      </Box>

      {/* Intro Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h2" component="h2" gutterBottom>
            {locale === 'en' ? 'Welcome to Livada Biotope' : 'Dobrodošli v Livada Biotop'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            {getContent(data.intro_en, data.intro_sl)}
          </Typography>
        </Box>

        {/* Featured Projects */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            {locale === 'en' ? 'Featured Projects' : 'Izbrani projekti'}
          </Typography>
          <Grid container spacing={4}>
            {data.featured_projects.map((project, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {project.thumbnail && (
                    <Box sx={{ position: 'relative', height: 200, width: '100%' }}>
                      <Image
                        src={project.thumbnail}
                        alt={getContent(project.title_en, project.title_sl)}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h4">
                      {getContent(project.title_en, project.title_sl)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getContent(
                        project.summary_en || '',
                        project.summary_sl || ''
                      )}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      href={`/projects/${project.slug}`}
                    >
                      {locale === 'en' ? 'View Project' : 'Ogled projekta'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Upcoming Events */}
        <Box>
          <Typography variant="h3" component="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            {locale === 'en' ? 'Upcoming Events' : 'Prihajajoči dogodki'}
          </Typography>
          <Grid container spacing={3}>
            {data.featured_events.map((event, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" component="h4" gutterBottom>
                    {getContent(event.title_en, event.title_sl)}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {new Date(event.date).toLocaleDateString(
                      locale === 'en' ? 'en-US' : 'sl-SI',
                      { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'long'
                      }
                    )}
                  </Typography>
                  {event.description_en && event.description_sl && (
                    <Typography paragraph>
                      {getContent(event.description_en, event.description_sl)}
                    </Typography>
                  )}
                  {event.link && (
                    <Button 
                      variant="outlined" 
                      component={Link} 
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {locale === 'en' ? 'Learn More' : 'Več informacij'}
                    </Button>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
