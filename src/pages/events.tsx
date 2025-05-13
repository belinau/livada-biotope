import React from 'react';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import TranslationLoader from '../components/TranslationLoader';
import { EnhancedEventCalendar } from '@/components/features/EnhancedEventCalendar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';

export default function Events() {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  return (
    <>
      {/* Use the simplified TranslationLoader */}
      <TranslationLoader />
      
      <Head>
        <title>{language === 'en' ? 'Events | The Livada Biotope' : 'Dogodki | Biotop Livada'}</title>
        <meta 
          name="description" 
          content={language === 'en' 
            ? "Join us for workshops, lectures, and community events at The Livada Biotope in Ljubljana, Slovenia." 
            : "Pridružite se nam na delavnicah, predavanjih in skupnostnih dogodkih v Biotopu Livada v Ljubljani."}
        />
      </Head>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            {language === 'en' ? 'Events' : 'Dogodki'}
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 6, 
              bgcolor: 'background.paper', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              {language === 'en' ? 'Join Our Community' : 'Pridružite se naši skupnosti'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "At The Livada Biotope, we host a variety of events throughout the year, from hands-on workshops and educational lectures to community gatherings and volunteer days. Check our calendar below to see what's coming up and join us!" 
                : "V Biotopu Livada gostimo različne dogodke skozi vse leto, od praktičnih delavnic in izobraževalnih predavanj do skupnostnih srečanj in prostovoljskih dni. Preverite naš koledar spodaj in se nam pridružite!"}
            </Typography>
          </Paper>
          
          {/* Enhanced Event Calendar Component */}
          <EnhancedEventCalendar />
          
          {/* Call to action */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mt: 6,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              bgcolor: green[50]
            }}
          >
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: green[800] }}>
              {language === 'en' ? 'Want to host an event?' : 'Želite organizirati dogodek?'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "If you're interested in hosting a workshop, lecture, or community event at The Livada Biotope, please get in touch with us. We welcome proposals that align with our mission of promoting biodiversity, ecological awareness, and community engagement." 
                : "Če vas zanima organizacija delavnice, predavanja ali skupnostnega dogodka v Biotopu Livada, se obrnite na nas. Dobrodošli so predlogi, ki so v skladu z našim poslanstvom spodbujanja biotske raznovrstnosti, ekološke ozaveščenosti in vključevanja skupnosti."}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              href="/contact" 
              sx={{ mt: 2, px: 4, py: 1 }}
            >
              {language === 'en' ? 'Contact Us' : 'Kontaktirajte nas'}
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
