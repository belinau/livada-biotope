import React, { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import StylizedImage from '../components/StylizedImage';
import { useLanguage } from '../contexts/LanguageContext';
import useTranslations from '../hooks/useTranslations';
import TranslationLoader from '../components/TranslationLoader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none', ...style }}>
    {children}
  </Link>
);

export default function Home() {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  return (
    <>
      {/* Use the simplified TranslationLoader */}
      <TranslationLoader />
      
      <Head>
        <title>{t('home.title', 'The Livada Biotope')} | {t('home.subtitle', 'Urban Biodiversity & Drought Resilience')}</title>
        <meta 
          name="description" 
          content={t('home.description', 'The Livada Biotope is a community-driven ecological project dedicated to preserving biodiversity and building drought resilience in Ljubljana, Slovenia.')}
        />
      </Head>
      
      {/* Hero Section with Full-width Image */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '80vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
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
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <StylizedImage 
            speciesName={{
              en: "Snake's Head Fritillary",
              sl: "Močvirski tulipan"
            }}
            latinName="Fritillaria meleagris"
            backgroundColor="#f8f5e6"
            patternColor="#2e7d32"
            pattern="dots"
            height="100%"
            width="100%"
            hideLatinName={true}
          />
        </Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              {language === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}
            </Typography>
            <Typography
              variant="h4"
              component="p"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 400,
                mb: 4,
                opacity: 0.9,
              }}
            >
              {language === 'en' ? 'A playground of encounters' : 'Igrišče srečanj'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                href="/projects"
                sx={{ px: 4, py: 1.5 }}
              >
                {language === 'en' ? 'Our Projects' : 'Naši projekti'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/contact"
                sx={{ px: 4, py: 1.5, borderColor: 'white', color: 'white' }}
              >
                {language === 'en' ? 'Get Involved' : 'Pridruži se'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Mission Statement Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="p"
                color="primary"
                sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
              >
                {language === 'en' ? 'OUR MISSION' : 'NAŠE POSLANSTVO'}
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{ fontWeight: 700, mb: 3 }}
              >
                {language === 'en' ? 'Preserving Urban Biodiversity' : 'Ohranjanje urbane biotske raznovrstnosti'}
              </Typography>
              <Typography paragraph sx={{ mb: 3 }}>
                {language === 'en' 
                  ? 'The Livada Biotope is conceived as a counter-space, a playground of encounters that supports different ways of relating to our kin in a decolonial manner. Under auspices of BOB Institute, we foster horizontality with other beings, plants, animals, fungi and microbiota, combining art, science, (post)humanities, ecofeminism, agriculture, somatics and other domains through transdisciplinary educational, experiential, social and political activities.'
                  : 'Biotop Livada je zasnovan kot protiprostor, igrišče srečanj, ki podpira različne načine povezovanja z našimi sorodniki na dekolonialen način. Pod okriljem Inštituta BOB spodbujamo horizontalnost z drugimi bitji, rastlinami, živalmi, glivami in mikrobioto, združujemo umetnost, znanost, (post)humanistiko, ekofeminizem, kmetijstvo, somatiko in druga področja skozi transdisciplinarne izobraževalne, izkustvene, družbene in politične dejavnosti.'}
              </Typography>
              <Typography paragraph>
                {language === 'en'
                  ? 'We are tackling the challenge of abandoning anthropocentric principles and immersing ourselves in the wetlands, to reactivate the inherent relational links between all the actors of the ecosystem. We want to empower the community to use the space according to ecofeminist biocentric notions where humans are part of the cross-species communal life on earth to the same extent and under the same conditions as other living beings. Humans are now custodians of the meadow, no longer masters or dominant extractive users of the environment.'
                  : 'Soočamo se z izzivom opuščanja antropocentričnih načel in potapljanja v mokrišča, da bi ponovno aktivirali inherentne odnosne povezave med vsemi akterji ekosistema. Želimo opolnomočiti skupnost za uporabo prostora v skladu z ekofeministično biocentrično predstavo, kjer so ljudje del medvrstnega skupnostnega življenja na zemlji v enakem obsegu in pod enakimi pogoji kot druga živa bitja. Ljudje so zdaj skrbniki travnika, ne več gospodarji ali prevladujoči ekstraktivni uporabniki okolja.'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/about"
                sx={{ mt: 2 }}
                endIcon={<Box component="span" sx={{ ml: 1 }}>→</Box>}
              >
                {language === 'en' ? 'Learn About Us' : 'Spoznajte nas'}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{
                  overflow: 'hidden',
                  borderRadius: 4,
                  transform: 'rotate(1deg)',
                  '&:hover': {
                    transform: 'rotate(0deg)',
                    boxShadow: 8,
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ width: '100%', height: { xs: '300px', sm: '400px', md: '500px' } }}>
                  <StylizedImage 
                    speciesName={{
                      en: "Great Crested Newt",
                      sl: "Veliki pupek"
                    }}
                    latinName="Triturus cristatus"
                    backgroundColor="#f1f7ed"
                    patternColor="#2e7d32"
                    pattern="dots"
                    height="100%"
                    width="100%"
                    imageSrc="https://livada-biotope.netlify.apphttps://livada-biotope.netlify.app/images/more-than-human.jpg"
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Projects Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
            <Typography
              variant="h6"
              component="p"
              color="primary"
              sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              {language === 'en' ? 'OUR PROJECTS' : 'NAŠI PROJEKTI'}
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 700, mb: 3, maxWidth: '800px', mx: 'auto' }}
            >
              {language === 'en' ? 'Ecological Initiatives at Livada Biotope' : 'Ekološke pobude v Biotopu Livada'}
            </Typography>
            <Typography sx={{ maxWidth: '700px', mx: 'auto' }}>
              {language === 'en'
                ? 'Discover our ongoing projects aimed at preserving biodiversity, building drought resilience, and educating the community about sustainable practices.'
                : 'Odkrijte naše tekoče projekte, usmerjene v ohranjanje biotske raznovrstnosti, krepitev odpornosti proti suši in izobraževanje skupnosti o trajnostnih praksah.'}
            </Typography>
          </Box>
          
          {/* Project Cards */}
          <Grid container spacing={4}>
            {/* Project Card 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: '200px', mb: 2 }}>
                  <StylizedImage 
                    speciesName={{
                      en: "Wetland Restoration",
                      sl: "Obnova mokrišč"
                    }}
                    backgroundColor="#f8f5e6"
                    patternColor="#2e7d32"
                    pattern="waves"
                    height="100%"
                    width="100%"
                    imageSrc="https://livada-biotope.netlify.apphttps://livada-biotope.netlify.app/images/illustrations/botanical-1.jpg"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    {language === 'en' ? 'Wetland Restoration' : 'Obnova mokrišč'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {language === 'en'
                      ? 'Restoring natural wetland habitats to support local biodiversity and improve water retention in urban areas.'
                      : 'Obnavljanje naravnih mokriščnih habitatov za podporo lokalni biotski raznovrstnosti in izboljšanje zadrževanja vode v urbanih območjih.'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} href="/projects/wetland-restoration">
                    {language === 'en' ? 'Learn More' : 'Več informacij'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Project Card 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: '220px', position: 'relative' }}>
                  <StylizedImage 
                    speciesName={{
                      en: "Common Kingfisher",
                      sl: "Vodomec"
                    }}
                    latinName="Alcedo atthis"
                    backgroundColor="#e0f7fa"
                    patternColor="#00838f"
                    pattern="waves"
                    height="100%"
                    width="100%"
                    imageSrc="https://livada-biotope.netlify.apphttps://livada-biotope.netlify.app/images/illustrations/zoological-1.jpg"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    {language === 'en' ? 'Community Garden' : 'Skupnostni vrt'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {language === 'en'
                      ? 'A collaborative space where community members grow native plants and learn about sustainable gardening practices.'
                      : 'Sodelovalni prostor, kjer člani skupnosti gojijo avtohtone rastline in se učijo o trajnostnih vrtnarskih praksah.'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} href="/projects/community-garden">
                    {language === 'en' ? 'Learn More' : 'Več informacij'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Project Card 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: '220px', position: 'relative' }}>
                  <StylizedImage 
                    speciesName={{
                      en: "Bee Orchid",
                      sl: "Čebelaska muhičnica"
                    }}
                    latinName="Ophrys apifera"
                    backgroundColor="#f9f3f3"
                    patternColor="#8c4a4a"
                    pattern="lines"
                    height="100%"
                    width="100%"
                    imageSrc="https://livada-biotope.netlify.apphttps://livada-biotope.netlify.app/images/biodiversity-monitoring.jpg"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    {language === 'en' ? 'Biodiversity Monitoring' : 'Spremljanje biotske raznovrstnosti'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {language === 'en'
                      ? 'Citizen science project to monitor and document the diverse species that inhabit the Livada Biotope ecosystem.'
                      : 'Projekt državljanske znanosti za spremljanje in dokumentiranje raznolikih vrst, ki naseljujejo ekosistem Biotopa Livada.'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} href="/projects/biodiversity-monitoring">
                    {language === 'en' ? 'Learn More' : 'Več informacij'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              href="/projects"
              endIcon={<Box component="span" sx={{ ml: 1 }}>→</Box>}
            >
              {language === 'en' ? 'View All Projects' : 'Ogled vseh projektov'}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
