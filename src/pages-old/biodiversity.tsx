import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';

import TranslationLoader from '../components/TranslationLoader';
import StylizedImage from '../components/StylizedImage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import INaturalistFeed from '../components/biodiversity/INaturalistFeed';

export default function Biodiversity() {
  const { language } = useLanguage();

  
  return (
    <>
      {/* Use the simplified TranslationLoader */}
      <TranslationLoader />
      
      <Head>
        <title>{language === 'en' ? 'Biodiversity | The Livada Biotope' : 'Biotska raznovrstnost | Biotop Livada'}</title>
        <meta 
          name="description" 
          content={language === 'en' 
            ? "Explore the rich biodiversity at The Livada Biotope through our citizen science monitoring and interspecies kinship approach." 
            : "Raziskujte bogato biotsko raznovrstnost v Biotopu Livada skozi naš pristop občanske znanosti in medvrstne sorodnosti."}
        />
      </Head>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            {language === 'en' ? 'Biodiversity' : 'Biotska raznovrstnost'}
          </Typography>
          
          <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              {language === 'en' ? 'Interspecies Kinship' : 'Medvrstna sorodnost'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "At The Livada Biotope, we embrace the concept of interspecies kinship – recognizing our deep connections with all living beings. We're not just observers of nature; we're active participants in a complex web of relationships that spans across species boundaries." 
                : "V Biotopu Livada sprejemamo koncept medvrstne sorodnosti – prepoznavamo naše globoke povezave z vsemi živimi bitji. Nismo le opazovalci narave; smo aktivni udeleženci v kompleksni mreži odnosov, ki sega preko meja vrst."}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "Through our biodiversity monitoring initiatives, we invite you to develop meaningful relationships with the more-than-human world around us. This isn't just about scientific observation – it's about nurturing connections, understanding interdependence, and developing ecological empathy." 
                : "Skozi naše pobude za spremljanje biotske raznovrstnosti vas vabimo, da razvijete smiselne odnose s svetom več-kot-človeškim okoli nas. Pri tem ne gre le za znanstveno opazovanje – gre za negovanje povezav, razumevanje soodvisnosti in razvijanje ekološke empatije."}
            </Typography>
          </Paper>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 6 }}>
            <Box>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 240 }}>
                  <StylizedImage
                    speciesName={{
                      en: "Biodiversity Monitoring",
                      sl: "Spremljanje biotske raznovrstnosti"
                    }}
                    latinName=""
                    backgroundColor="#f8f5e6"
                    patternColor="#2e7d32"
                    pattern="dots"
                    height="100%"
                    width="100%"
                    imageSrc="/images/biodiversity-monitoring.jpg"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {language === 'en' ? 'Citizen Science' : 'Občanska znanost'}
                  </Typography>
                  <Typography>
                    {language === 'en' 
                      ? "Join our citizen science efforts to document and celebrate the incredible diversity of species that call Livada home. Every observation matters!" 
                      : "Pridružite se našim prizadevanjem za občansko znanost, da dokumentiramo in proslavimo neverjetno raznolikost vrst, ki Livado imenujejo dom. Vsako opažanje je pomembno!"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 240 }}>
                  <StylizedImage
                    speciesName={{
                      en: "Wetland Habitat",
                      sl: "Mokriški habitat"
                    }}
                    latinName=""
                    backgroundColor="#f8f5e6"
                    patternColor="#d84315"
                    pattern="waves"
                    height="100%"
                    width="100%"
                    imageSrc="/images/fritillaria.jpg"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {language === 'en' ? 'More-Than-Human World' : 'Več-kot-človeški svet'}
                  </Typography>
                  <Typography>
                    {language === 'en' 
                      ? "Explore the rich tapestry of life beyond humans. From tiny soil microbes to plants, insects, and birds, Livada is a thriving community of diverse beings." 
                      : "Raziščite bogato tapiserijo življenja onkraj ljudi. Od drobnih talnih mikrobov do rastlin, žuželk in ptic, Livada je cvetoča skupnost raznolikih bitij."}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            {language === 'en' ? 'Recent Observations' : 'Nedavna opažanja'}
          </Typography>
          
          <INaturalistFeed />
        </Box>
      </Container>
    </>
  );
}
