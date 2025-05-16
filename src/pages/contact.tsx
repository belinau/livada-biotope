import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import TranslationLoader from '@/components/TranslationLoader';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Divider, 
  useTheme,
  useMediaQuery,
  Link as MuiLink,
  IconButton,
  styled
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Types
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
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
}

// Styled components
const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
    {children}
  </Link>
);

export default function ContactPage({ content }: ContactPageProps) {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getContent = (en: string, sl: string) => (language === 'en' ? en : sl);
  const title = getContent(content.title_en, content.title_sl);
  const body = getContent(content.body_en, content.body_sl);
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, you would send this data to your API
      console.log('Form submitted:', formData);
      alert(t('contact.form.submitSuccess', 'Thank you for your message! We will get back to you soon.'));
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('contact.form.submitError', 'There was an error sending your message. Please try again later.'));
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
          content={t('contact.metaDescription', 'Get in touch with Livada Biotope. Contact us for collaborations, questions, or to learn more about our projects.')} 
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
            src="/images/uploads/pxl_20250427_174211296.jpg"
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
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <StyledCard elevation={3}>
              <Box 
                sx={{ 
                  mb: 4,
                  '& h2': {
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                  },
                  '& p': {
                    color: 'text.secondary',
                    mb: 3,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: processMarkdown(body) }}
              />
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label={t('contact.form.name')}
                  variant="outlined"
                  required
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label={t('contact.form.email')}
                  variant="outlined"
                  type="email"
                  required
                  margin="normal"
                />
                
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel id="subject-label">
                    {t('contact.form.subject')}
                  </InputLabel>
                  <Select
                    labelId="subject-label"
                    label={t('contact.form.subject')}
                    defaultValue=""
                    required
                  >
                    <MenuItem value="">
                      <em>{t('contact.form.selectSubject')}</em>
                    </MenuItem>
                    <MenuItem value="general">
                      {t('contact.form.generalInquiry')}
                    </MenuItem>
                    <MenuItem value="volunteer">
                      {t('contact.form.volunteering')}
                    </MenuItem>
                    <MenuItem value="project">
                      {t('contact.form.projectCollaboration')}
                    </MenuItem>
                    <MenuItem value="donation">
                      {t('contact.form.donations')}
                    </MenuItem>
                    <MenuItem value="other">
                      {t('contact.form.other')}
                    </MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label={t('contact.form.message')}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  margin="normal"
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ mt: 2, fontWeight: 'medium' }}
                >
                  {t('contact.form.submit')}
                </Button>
              </form>
            </StyledCard>
          </Grid>
          
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <StyledCard elevation={3}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom color="primary.main">
                  {t('contact.info.title', 'Contact Information')}
                </Typography>
                <Typography paragraph>
                  {t('contact.info.description', 'Feel free to reach out to us for any questions or collaborations.')}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="primary" sx={{ mr: 2 }} />
                  <MuiLink href={`mailto:${content.email}`} color="inherit">
                    {content.email}
                  </MuiLink>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <LocationOnIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
                  <Box>
                    {content.address.split('\n').map((line, i) => (
                      <Typography key={i} paragraph={i < content.address.split('\n').length - 1}>
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </Box>
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LocationOnIcon />}
                  href={`https://www.google.com/maps?q=${content.map_coordinates}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mb: 3 }}
                >
                  {t('contact.info.viewOnMap', 'View on Map')}
                </Button>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h5" component="h3" gutterBottom color="primary.main">
                  {t('contact.info.followUs', 'Follow Us')}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  {content.social.facebook && (
                    <IconButton 
                      href={content.social.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      <FacebookIcon />
                    </IconButton>
                  )}
                  
                  {content.social.instagram && (
                    <IconButton 
                      href={content.social.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                  
                  {content.social.twitter && (
                    <IconButton 
                      href={content.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      <TwitterIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
        
        <Paper elevation={2} sx={{ mt: 6, p: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom color="primary.main">
            {t('contact.visitUs', 'Visit Us')}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {t('contact.visitDescription', 'We welcome visitors to our biotope. Please contact us in advance to schedule your visit.')}
          </Typography>
          
          <Box sx={{ 
            height: '400px', 
            bgcolor: '#e0e0e0', 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mt: 2 
          }}>
            <Typography variant="body1" color="text.secondary">
              {t('contact.mapPlaceholder', 'Map will be displayed here')}
            </Typography>
          </Box>
        </Paper>
        
        <Divider sx={{ my: 6 }} />
        
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {t('contact.copyright', 'Livada Biotope. All rights reserved.')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
