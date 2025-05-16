import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import useTranslations from '../hooks/useTranslations';
import TranslationLoader from '../components/TranslationLoader';
import StylizedImage from '../components/StylizedImage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@/components/ui/Grid'; // Custom Grid component with proper types
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Types
interface Project {
  slug: string;
  title_en: string;
  title_sl: string;
  summary_en?: string;
  summary_sl?: string;
  thumbnail?: string;
  date?: string;
}

interface Event {
  title_en: string;
  title_sl: string;
  date: string;
  description_en?: string;
  description_sl?: string;
  link?: string;
}

interface HomePageProps {
  homeData: {
    title_en: string;
    title_sl: string;
    summary_en: string;
    summary_sl: string;
    hero_text_en: string;
    hero_text_sl: string;
    subtitle_en: string;
    subtitle_sl: string;
    hero_image: string;
    intro_en: string;
    intro_sl: string;
    featured_projects: Project[];
    featured_events: Event[];
  };
}

// Helper function to format date
const formatDate = (dateString: string, locale: 'en' | 'sl' = 'en'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Home({ homeData }: HomePageProps) {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  const currentLang = language === 'en' ? 'en' : 'sl';
  const getContent = (en: string, sl: string) => (language === 'en' ? en : sl);

  return (
    <>
      <TranslationLoader />
      
      <Head>
        <title>{getContent(homeData.title_en, homeData.title_sl)}</title>
        <meta 
          name="description" 
          content={getContent(homeData.summary_en || '', homeData.summary_sl || '')}
        />
      </Head>
      
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
        {homeData.hero_image && (
          <Box sx={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%',
            zIndex: 0
          }}>
            <Image
              src={homeData.hero_image}
              alt={getContent(homeData.title_en, homeData.title_sl)}
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
            {getContent(homeData.hero_text_en, homeData.hero_text_sl)}
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
            {getContent(homeData.subtitle_en, homeData.subtitle_sl)}
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={Link}
            href="/about"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              }
            }}
 >
            {t('common.learnMore')}
          </Button>
        </Container>
      </Box>
      
      {/* Introduction Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              '& h2': {
                fontSize: '2rem',
                fontWeight: 700,
                mb: 3,
                color: 'primary.main',
                textAlign: 'center'
              },
              '& h3': {
                fontSize: '1.5rem',
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
                mt: 4
              },
              '& p': {
                fontSize: '1.1rem',
                lineHeight: 1.8,
                mb: 3,
                textAlign: 'left'
              },
              '& ul, & ol': {
                pl: 3,
                mb: 3,
                '& li': {
                  mb: 1,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }
              }
            }}
            dangerouslySetInnerHTML={{ 
              __html: getContent(homeData.intro_en, homeData.intro_sl)
                .replace(/\n/g, '<br />')
                .replace(/^#\s+(.*)$/gm, '<h2>$1</h2>')
                .replace(/^##\s+(.*)$/gm, '<h3>$1</h3>')
                .replace(/^###\s+(.*)$/gm, '<h4>$1</h4>')
            }} 
          />
        </Container>
      </Box>
      
      {/* Mission Statement Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid xs={12} md={6}>
              <Typography
                variant="h6"
                component="p"
                color="primary"
                sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
              >
                {t('home.ourMission')}
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{ fontWeight: 700, mb: 3 }}
 >
                {t('home.preservingBiodiversity')}
              </Typography>
              <Typography paragraph sx={{ mb: 3 }}>
                {t('home.missionDescription', getContent(homeData.intro_en, homeData.intro_sl).split('\n\n').find(p => p.includes('mission') || p.includes('poslanstvo')) || '')}
              </Typography>
              <Typography paragraph>
                {t('home.missionExtended', getContent(homeData.intro_en, homeData.intro_sl).split('\n\n').find(p => p.includes('aim') || p.includes('cilj')) || '')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/about"
                sx={{ mt: 2 }}
                endIcon={<Box component="span" sx={{ ml: 1 }}>→</Box>}
 >
                {t('nav.about')}
              </Button>
            </Grid>
            <Grid xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{
                  overflow: 'hidden',
                  borderRadius: 4,
                  transform: 'rotate(1deg)',
                  '&:hover': {
                    transform: 'rotate(0deg)',
                    boxShadow: 8
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
              {t('projects.sectionTitle')}
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 700, mb: 3, maxWidth: '800px', mx: 'auto' }}
 >
              {t('projects.sectionSubtitle')}
            </Typography>
            <Typography sx={{ maxWidth: '700px', mx: 'auto' }}>
              {t('projects.sectionDescription')}
            </Typography>
          </Box>
          
          {/* Project Cards */}
          <Grid container spacing={4} disableEqualOverflow>
            {/* Project Card 1 */}
            <Grid xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: '200px', mb: 2 }}>
                  <StylizedImage 
                    speciesName={{
                      en: t('projects.wetlandRestoration.title', 'Wetland Restoration'),
                      sl: t('projects.wetlandRestoration.titleSl', 'Obnova mokrišč')
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
                    {t('projects.wetlandRestoration.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('projects.wetlandRestoration.description')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} href="/projects/wetland-restoration">
                    {t('common.learnMore')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Project Card 2 */}
            <Grid xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: '220px', position: 'relative' }}>
                  <StylizedImage 
                    speciesName={{
                      en: t('species.commonKingfisher.en', 'Common Kingfisher'),
                      sl: t('species.commonKingfisher.sl', 'Vodomec')
                    }}
                    latinName={t('species.commonKingfisher.latin', 'Alcedo atthis')}
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
                    {t('projects.communityGarden.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('projects.communityGarden.description')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} href="/projects/community-garden">
                    {t('common.learnMore')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            {/* Project Card 3 */}
            <Grid xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: '220px', position: 'relative' }}>
                  <StylizedImage 
                    speciesName={{
                      en: t('species.beeOrchid.en', 'Bee Orchid'),
                      sl: t('species.beeOrchid.sl', 'Čebelaska muhičnica')
                    }}
                    latinName={t('species.beeOrchid.latin', 'Ophrys apifera')}
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
                    {t('projects.biodiversity.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('projects.biodiversity.description')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} href="/projects/biodiversity-monitoring">
                    {t('common.learnMore')}
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
              {t('projects.viewAll')}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const homeFilePath = path.join(process.cwd(), 'src/content/pages/home.md');
  const homeContent = fs.readFileSync(homeFilePath, 'utf8');
  const { data } = matter(homeContent);

  return {
    props: {
      homeData: data,
    },
  };
};
