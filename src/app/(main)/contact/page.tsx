/** @jsxImportSource @emotion/react */
'use client';

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { 
  Box, 
  Container, 
  Typography, 
  Card,
  CardContent,
  Grid,
  Link,
  Paper,
  Skeleton
} from '@mui/material';

// Dynamic import for ContactForm - adjusted to match the actual export
const ContactForm = dynamic(
  () => import('@/components/contact/ContactForm').then(mod => mod as any),
  { 
    ssr: false,
    loading: () => <Skeleton variant="rectangular" height={400} />
  }
);

interface ContactPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: ContactPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact.metadata' });
  
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

export default async function ContactPage({ params: { locale } }: ContactPageProps) {
  // Set the request locale for this page
  setRequestLocale(locale);
  
  // Get translations
  const t = await getTranslations('contact');
  
  // Get contact info translations
  const contactInfo = {
    email: t('contactInfo.email'),
    address: t('contactInfo.address'),
    addressLine1: t('contactInfo.addressLine1'),
    addressLine2: t('contactInfo.addressLine2'),
    social: t('contactInfo.social'),
    socialLinks: {
      facebook: {
        url: t('contactInfo.socialLinks.facebook.url'),
        label: t('contactInfo.socialLinks.facebook.label')
      },
      instagram: {
        url: t('contactInfo.socialLinks.instagram.url'),
        label: t('contactInfo.socialLinks.instagram.label')
      },
      twitter: {
        url: t('contactInfo.socialLinks.twitter.url'),
        label: t('contactInfo.socialLinks.twitter.label')
      },
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '40vh', md: '50vh' },
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
            src="/images/contact.jpg"
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
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              mb: 2,
            }}
          >
            {t('title')}
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  {t('form.title')}
                </Typography>
                <ContactForm />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  {t('contactInfo.title')}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {t('contactInfo.email')}
                  </Typography>
                  <Typography variant="body1" component="p">
                    <Link href={`mailto:${contactInfo.email}`} color="inherit">
                      {contactInfo.email}
                    </Link>
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {t('contactInfo.address')}
                  </Typography>
                  <Typography variant="body1" component="p">
                    {contactInfo.addressLine1}<br />
                    {contactInfo.addressLine2}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {t('contactInfo.social')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {Object.entries(contactInfo.socialLinks).map(([key, social]) => (
                      <Link 
                        key={key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        color="inherit"
                      >
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                          }}
                        >
                          <i className={`fab fa-${key}`} style={{ fontSize: 20 }} />
                        </Box>
                      </Link>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Box sx={{ mt: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('map.title')}
                  </Typography>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: 300,
                      width: '100%',
                      mt: 2,
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2768.1234567890123!2d14.5058!3d46.0569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDAzJzI0LjgiTiAxNMKwMzAnMjAuOSJF!5e0!3m2!1sen!2ssi!4v1234567890123!5m2!1sen!2ssi`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={t('map.ariaLabel')}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
