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
  Button, 
  TextField, 
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid
} from '@mui/material';

interface ContactPageProps {
  content: {
    title_en: string;
    title_sl: string;
    body_en: string;
    body_sl: string;
    email: string;
    address: string;
    map_location: string;
    map_coordinates: string;
    social: {
      [key: string]: string;
    };
  };
}

const defaultContent = {
  title_en: 'Contact Us',
  title_sl: 'Kontaktirajte nas',
  body_en: 'Error loading content. Please try again later.',
  body_sl: 'Napaka pri nalaganju vsebine. Poskusite znova kasneje.',
  email: 'info@livadabiotop.si',
  address: 'Livada, 1234 City, Country',
  map_location: 'https://www.google.com/maps/embed?pb=...',
  map_coordinates: '46.0569,14.5058',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
};

export default function ContactPage({ content = {} }: { content?: Partial<ContactPageProps['content']> }) {
  const { language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Simple translation function fallback - only using the fallback value for now
  const t = (_key: string, fallback: string) => fallback;

  // Use provided content or fall back to defaults
  const safeContent = { ...defaultContent, ...content };
  
  const getContent = (en: string, sl: string) => {
    return language === 'sl' ? sl : en;
  };
  
  const title = getContent(safeContent.title_en, safeContent.title_sl);
  const body = getContent(safeContent.body_en, safeContent.body_sl);
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Handle form submission here
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Process markdown content
  const processMarkdown = (text: string) => {
    if (!text) return '';
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
      <TranslationLoader />
      <Head>
        <title>{`${title} | Livada Biotope`}</title>
        <meta 
          name="description" 
          content="Get in touch with Livada Biotope. Contact us for collaborations, questions, or to learn more about our projects." 
        />
      </Head>
      
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
            alt="Livada Biotope contact"
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
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              mb: 2,
            }}
          >
            {title}
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  {t('contact.form.title', 'Send us a message')}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label={t('contact.form.name', 'Your name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label={t('contact.form.email', 'Email address')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label={t('contact.form.subject', 'Subject')}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label={t('contact.form.message', 'Your message')}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 3 }}
                  >
                    {t('contact.form.submit', 'Send message')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  {t('contact.info.title', 'Contact Information')}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Box 
                  dangerouslySetInnerHTML={{ __html: processMarkdown(body) }}
                  sx={{ 
                    '& h2': { 
                      mt: 4,
                      mb: 2,
                      color: 'primary.main',
                      fontSize: '1.75rem',
                      fontWeight: 600,
                    },
                    '& h3': {
                      mt: 3,
                      mb: 1.5,
                      color: 'text.primary',
                      fontSize: '1.25rem',
                      fontWeight: 500,
                    },
                    '& p': {
                      mb: 2,
                      lineHeight: 1.8,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // You can fetch content here if needed
  return {
    props: {
      content: {}
    },
  };
};
