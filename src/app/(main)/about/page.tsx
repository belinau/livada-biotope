import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale } from '@/config/i18n';

interface AboutPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({ params: { locale } }: AboutPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about.metadata' });
  
  return {
    title: `${t('title')} | Biotop Livada`,
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
      siteName: 'Biotop Livada',
    },
  };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  setRequestLocale(locale);
  const { locale: currentLocale } = useLanguage();
  const t = await getTranslations('about');
  
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
    <Box>
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
            alt={t('hero.alt')}
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
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              textShadow: '0 2px 10px rgba(0,0,0,0.7)',
              lineHeight: 1.2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            {t('title')}
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
          dangerouslySetInnerHTML={{ __html: processMarkdown(t('content')) }}
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
            {t('galleryTitle')}
          </Typography>
          <Grid container spacing={3}>
            {[
              '/images/uploads/pxl_20250427_173829850.jpg',
              '/images/uploads/pxl_20250427_173838513.jpg',
              '/images/uploads/pxl_20250427_174107765.jpg',
              '/images/uploads/pxl_20250427_174118623.jpg',
              '/images/uploads/pxl_20250427_174211296.jpg',
              '/images/uploads/pxl_20250427_174242140.jpg',
            ].map((src, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 300,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                    '&:hover img': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Image
                    src={src}
                    alt={`${t('gallery.alt')} ${index + 1}`}
                    fill
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
