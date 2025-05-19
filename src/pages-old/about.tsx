import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

import TranslationLoader from '@/components/TranslationLoader';
import { 
  Box, 
  Container, 
  Typography, 
  useTheme,
  useMediaQuery,
  Grid 
} from '@mui/material';

// Types
interface AboutPageProps {
  content: {
    title_en: string;
    title_sl: string;
    body_en: string;
    body_sl: string;
  };
}



export default function AboutPage({ content }: AboutPageProps) {
  const { language } = useLanguage();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getContent = (en: string, sl: string) => (language === 'en' ? en : sl);
  const title = getContent(content.title_en, content.title_sl);
  const body = getContent(content.body_en, content.body_sl);

  // Process markdown content
  const processMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((paragraph, i) => {
        if (paragraph.startsWith('## ')) {
          return `<h2 style="margin-top: ${i > 0 ? '2.5rem' : '1.5rem'}; margin-bottom: 1rem;">${paragraph.substring(3)}</h2>`;
        }
        if (paragraph.startsWith('### ')) {
          return `<h3 style="margin-top: 2rem; margin-bottom: 1rem;">${paragraph.substring(4)}</h3>`;
        }
        if (paragraph.trim() === '') {
          return '';
        }
        return `<p style="margin-bottom: 1.25rem; line-height: 1.7;">${paragraph}</p>`;
      })
      .join('');
  };

  return (
    <>
      <TranslationLoader />
      <Head>
        <title>{title} | Livada Biotope</title>
        <meta 
          name="description" 
          content="Learn more about Livada Biotope, our mission, and our team." 
        />
      </Head>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '50vh', md: '60vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <Image
            src="/images/uploads/pxl_20250427_173714623.jpg"
            alt="Livada Biotope landscape"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            priority
          />
        </Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: 3 }}>
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              textShadow: '0 2px 10px rgba(0,0,0,0.7)',
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            '& h2': {
              fontSize: '2rem',
              fontWeight: 700,
              mb: 3,
              color: 'primary.main',
              mt: 6,
              '&:first-of-type': {
                mt: 0,
              },
            },
            '& h3': {
              fontSize: '1.5rem',
              fontWeight: 600,
              mb: 2,
              color: 'text.primary',
              mt: 4,
            },
            '& p': {
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3,
              color: 'text.secondary',
            },
            '& ul, & ol': {
              pl: 3,
              mb: 3,
              '& li': {
                mb: 1,
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'text.secondary',
              },
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: processMarkdown(body) }}
        />
      </Container>

      {/* Gallery Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'primary.main',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            Our Space
          </Typography>
          <Grid container spacing={3}>
            {[
              '/images/uploads/pxl_20250427_173829850.jpg',
              '/images/uploads/pxl_20250427_173838513.jpg',
              '/images/uploads/pxl_20250427_174107765.jpg',
              '/images/uploads/pxl_20250427_174118623.jpg',
              '/images/uploads/pxl_20250427_174211296.jpg',
              '/images/uploads/pxl_20250427_174242140.jpg'
            ].map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ 
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                  transition: 'all 0.3s ease-in-out',
                  height: 300,
                  width: '100%'
                }}>
                  <Image
                    src={image}
                    alt={`Space photo ${index + 1}`}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const matter = (await import('gray-matter')).default;
    
    const aboutFilePath = path.join(process.cwd(), 'src/content/pages/about.md');
    const aboutContent = await fs.readFile(aboutFilePath, 'utf8');
    const { data } = matter(aboutContent);

    // Ensure all required fields have default values
    const content = {
      title_en: data.title_en || 'About Us',
      title_sl: data.title_sl || 'O nas',
      body_en: data.body_en || '',
      body_sl: data.body_sl || ''
    };

    return {
      props: { content },
      revalidate: 3600 // Revalidate at most once per hour
    };
  } catch (error) {
    console.error('Error loading about page content:', error);
    return {
      props: {
        content: {
          title_en: 'About Us',
          title_sl: 'O nas',
          body_en: 'Error loading content. Please try again later.',
          body_sl: 'Napaka pri nalaganju vsebine. Poskusite znova kasneje.'
        }
      },
      revalidate: 60 // Retry after 1 minute on error
    };
  }
};
