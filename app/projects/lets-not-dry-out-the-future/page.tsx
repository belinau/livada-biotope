import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Container, Typography, Box, Grid, Button, Divider, Paper, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import SensorVisualization from '@/components/features/SensorVisualization';
import BiodiversityShowcase, { BiodiversityItem } from '@/components/features/BiodiversityShowcase';
import Link from 'next/link';
import { DataSource } from '@/lib/sensorService';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects.letsNotDryOutTheFuture' });
  
  return {
    title: t('title'),
    description: t('summary'),
    openGraph: {
      title: t('title'),
      description: t('summary'),
      images: [
        {
          url: '/images/projects/lets-not-dry-out-the-future/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Livada Biotope - Let\'s Not Dry Out The Future',
        },
      ],
    },
  };
}

export default function LetsNotDryOutTheFuturePage({
  params: { locale },
}: Props) {
  const t = useTranslations('projects.letsNotDryOutTheFuture');
  const theme = useTheme();
  
  // Mock data - replace with actual data from your API
  const biodiversityItems: BiodiversityItem[] = [
    {
      id: '1',
      name: {
        en: 'Common Dandelion',
        sl: 'Navadni regrat',
        scientific: 'Taraxacum officinale'
      },
      type: 'plant',
      description: {
        en: 'A common wildflower found in meadows and lawns, important for pollinators.',
        sl: 'Običajna divja roža, ki jo najdemo na travnikih in travnikih, pomembna za opraševalce.'
      },
      imageUrl: '/images/biodiversity/dandelion.jpg',
      inaturalistUrl: 'https://www.inaturalist.org/taxa/48591-Taraxacum-officinale',
      observedAt: '2023-05-15T10:30:00Z',
      observedBy: 'Livada Team'
    },
    {
      id: '2',
      name: {
        en: 'European Honey Bee',
        sl: 'Evropska čebela',
        scientific: 'Apis mellifera'
      },
      type: 'animal',
      description: {
        en: 'An important pollinator for many plants, essential for ecosystem health.',
        sl: 'Pomemben opraševalec številnih rastlin, ključnega pomena za zdravje ekosistema.'
      },
      imageUrl: '/images/biodiversity/bee.jpg',
      inaturalistUrl: 'https://www.inaturalist.org/taxa/47219-Apis-mellifera',
      observedAt: '2023-05-16T14:20:00Z',
      observedBy: 'Livada Team'
    },
    {
      id: '3',
      name: {
        en: 'Common Earthworm',
        sl: 'Navadni deževnik',
        scientific: 'Lumbricus terrestris'
      },
      type: 'animal',
      description: {
        en: 'Improves soil structure and nutrient cycling, vital for healthy soil.',
        sl: 'Izboljšuje strukturo in kroženje hranil v prsti, ključnega pomena za zdrava tla.'
      },
      imageUrl: '/images/biodiversity/earthworm.jpg',
      inaturalistUrl: 'https://www.inaturalist.org/taxa/48420-Lumbricus-terrestris',
      observedAt: '2023-05-17T09:15:00Z',
      observedBy: 'Livada Team'
    }
  ];

  return (
    <Box sx={{ 
      bgcolor: 'background.default',
      minHeight: '100vh',
      pt: { xs: 4, md: 8 },
      pb: 8
    }}>
      {/* Hero Section */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: 8,
        mb: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/images/projects/lets-not-dry-out-the-future/hero-bg.jpg) center/cover no-repeat',
          opacity: 0.1,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {t('title')}
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            sx={{
              maxWidth: '800px',
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              opacity: 0.95,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            {t('summary')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              href={`/${locale}/about`}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              {t('learnMore')}
            </Button>
            <Button 
              variant="outlined" 
              color="inherit"
              size="large"
              component={Link}
              href={`#sensor-data`}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              {t('viewData')}
            </Button>
          </Box>
        </Container>
      </Box>


      {/* Sensor Data Section */}
      <Container maxWidth="lg" id="sensor-data" sx={{ mb: 12, scrollMarginTop: '80px' }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ 
            mb: 2,
            fontWeight: 700,
            color: 'primary.dark',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            {t('sensorData.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            {t('sensorData.description')}
          </Typography>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            mb: 6
          }}
        >
          <SensorVisualization 
            sensorId="1" 
            title={t('sensorData.soilMoisture')} 
            height={400}
            dataSource={DataSource.MOCK}
          />
        </Paper>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                {t('sensorData.whyItMatters')}
              </Typography>
              <Typography paragraph>
                {t('sensorData.whyItMattersText')}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                component={Link}
                href={`/${locale}/projects/sensor-network`}
                sx={{ mt: 2 }}
              >
                {t('learnMoreAboutSensors')}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                {t('sensorData.howToHelp')}
              </Typography>
              <Typography paragraph>
                {t('sensorData.howToHelpText')}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                href={`/${locale}/get-involved`}
                sx={{ mt: 2 }}
              >
                {t('getInvolved')}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Biodiversity Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" component="h2" sx={{ 
              mb: 2,
              fontWeight: 700,
              color: 'primary.dark',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}>
              {t('biodiversity.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              {t('biodiversity.description')}
            </Typography>
          </Box>
          
          <BiodiversityShowcase 
            items={biodiversityItems} 
            showHeader={false}
            maxItems={3}
          />
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              component={Link}
              href={`/${locale}/biodiversity`}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              {t('viewAllSpecies')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'primary.contrastText',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url(/images/patterns/dots-pattern.svg) center/cover no-repeat',
              opacity: 0.1,
              zIndex: 0,
            }
          }}
        >
          <Box position="relative" zIndex={1}>
            <Typography variant="h3" component="h2" sx={{ 
              mb: 3,
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.75rem' },
              lineHeight: 1.2
            }}>
              {t('cta.title')}
            </Typography>
            <Typography variant="h6" sx={{ 
              mb: 4, 
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.95,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}>
              {t('cta.description')}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              href={`/${locale}/donate`}
              sx={{
                px: 6,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              {t('supportUs')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
