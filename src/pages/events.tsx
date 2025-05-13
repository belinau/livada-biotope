import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import TranslationLoader from '../components/TranslationLoader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function Events() {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [tabValue, setTabValue] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Set isClient to true when component mounts (for SSR compatibility)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Google Calendar ID
  const calendarId = 'c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7@group.calendar.google.com';
  
  // Calendar embed URLs for different views
  const calendarUrls = {
    agenda: `https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FLjubljana&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&src=${encodeURIComponent(calendarId)}`,
    month: `https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FLjubljana&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=MONTH&src=${encodeURIComponent(calendarId)}`
  };
  
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
          
          <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              {language === 'en' ? 'Join Our Community' : 'Pridružite se naši skupnosti'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "At The Livada Biotope, we host a variety of events throughout the year, from hands-on workshops and educational lectures to community gatherings and volunteer days. Check our calendar below to see what's coming up and join us!" 
                : "V Biotopu Livada gostimo različne dogodke skozi vse leto, od praktičnih delavnic in izobraževalnih predavanj do skupnostnih srečanj in prostovoljskih dni. Preverite naš koledar spodaj in se nam pridružite!"}
            </Typography>
          </Paper>
          
          {/* Calendar view selector tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="calendar view tabs">
              <Tab label={language === 'en' ? 'Upcoming Events' : 'Prihajajoči dogodki'} />
              <Tab label={language === 'en' ? 'Monthly Calendar' : 'Mesečni koledar'} />
            </Tabs>
          </Box>
          
          {/* Calendar embed */}
          {isClient && (
            <Box sx={{ 
              height: '600px', 
              width: '100%', 
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 2,
              mb: 4
            }}>
              <iframe 
                src={tabValue === 0 ? calendarUrls.agenda : calendarUrls.month}
                style={{ 
                  border: 0,
                  width: '100%',
                  height: '100%'
                }}
                frameBorder="0"
                scrolling="no"
                title={language === 'en' ? 'Livada Biotope Events Calendar' : 'Koledar dogodkov Biotop Livada'}
                allowFullScreen
              />
            </Box>
          )}
          
          <Box sx={{ mt: 6, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: 'primary.main' }}>
              {language === 'en' ? 'Want to host an event?' : 'Želite organizirati dogodek?'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "If you're interested in hosting a workshop, lecture, or community event at The Livada Biotope, please get in touch with us. We welcome proposals that align with our mission of promoting biodiversity, ecological awareness, and community engagement." 
                : "Če vas zanima organizacija delavnice, predavanja ali skupnostnega dogodka v Biotopu Livada, nas prosimo kontaktirajte. Veseli smo predlogov, ki so v skladu z našim poslanstvom spodbujanja biotske raznovrstnosti, ekološke ozaveščenosti in vključevanja skupnosti."}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {language === 'en' ? 'Contact: ' : 'Kontakt: '} 
              <a href="mailto:info@livada.bio" style={{ color: 'primary.main' }}>info@livada.bio</a>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
