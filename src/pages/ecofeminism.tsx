import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import useTranslations from '../hooks/useTranslations';
import TranslationLoader from '../components/TranslationLoader';
import StylizedImage from '../components/StylizedImage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Ecofeminism() {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  // Define the pattern type to match StylizedImage component
  type PatternType = 'dots' | 'waves' | 'lines' | 'leaves';
  
  // Resources data
  const resources = [
    {
      title: t('ecofeminism.resources.decolonial-composting.title'),
      description: t('ecofeminism.resources.decolonial-composting.description'),
      speciesName: { en: "Earthworm", sl: "Deževnik" },
      latinName: "Lumbricus terrestris",
      pattern: "dots" as PatternType
    },
    {
      title: t('ecofeminism.resources.interspecies-solidarity.title'),
      description: t('ecofeminism.resources.interspecies-solidarity.description'),
      speciesName: { en: "Honey Bee", sl: "Medonosna čebela" },
      latinName: "Apis mellifera",
      pattern: "waves" as PatternType
    },
    {
      title: t('ecofeminism.resources.care-politics.title'),
      description: t('ecofeminism.resources.care-politics.description'),
      speciesName: { en: "Medicinal Sage", sl: "Žajbelj" },
      latinName: "Salvia officinalis",
      pattern: "leaves" as PatternType
    }
  ];
  
  // Reading recommendations
  const readings = [
    {
      title: t('ecofeminism.readings.staying-with-the-trouble.title'),
      author: "Donna Haraway",
      description: t('ecofeminism.readings.staying-with-the-trouble.description')
    },
    {
      title: t('ecofeminism.readings.braiding-sweetgrass.title'),
      author: "Robin Wall Kimmerer",
      description: t('ecofeminism.readings.braiding-sweetgrass.description')
    },
    {
      title: t('ecofeminism.readings.the-mushroom-at-the-end-of-the-world.title'),
      author: "Anna Lowenhaupt Tsing",
      description: t('ecofeminism.readings.the-mushroom-at-the-end-of-the-world.description')
    }
  ];
  
  // Videos and podcasts
  const media = [
    {
      name: "Donna Haraway",
      title: t('ecofeminism.media.staying-with-the-trouble.title'),
      description: t('ecofeminism.media.staying-with-the-trouble.description'),
      type: "video",
      url: "https://www.youtube.com/watch?v=GrYA7sMQaBQ"
    },
    {
      name: "Bayo Akomolafe",
      title: t('ecofeminism.media.post-activism-and-decolonial-fugitivity.title'),
      description: t('ecofeminism.media.post-activism-and-decolonial-fugitivity.description'),
      type: "video",
      url: "https://www.youtube.com/watch?v=pRFVJ5OoH_A"
    },
    {
      name: "Bojana Kunst",
      title: t('ecofeminism.media.the-life-of-art.title'),
      description: t('ecofeminism.media.the-life-of-art.description'),
      type: "video",
      url: "https://intima.org/kunst/zivljenje/index.html"
    },
    {
      name: "Sophie Strand",
      title: t('ecofeminism.media.the-ecology-of-story.title'),
      description: t('ecofeminism.media.the-ecology-of-story.description'),
      type: "video",
      url: "https://www.youtube.com/watch?v=VtJ5EUxycCw"
    },
    {
      name: "Merlin Sheldrake",
      title: t('ecofeminism.media.entangled-life.title'),
      description: t('ecofeminism.media.entangled-life.description'),
      type: "podcast",
      url: "https://www.youtube.com/watch?v=LLrTPrp-fW8"
    },
    {
      name: "Aníbal Quijano",
      title: t('ecofeminism.media.coloniality-of-power-and-eurocentrism.title'),
      description: t('ecofeminism.media.coloniality-of-power-and-eurocentrism.description'),
      type: "video",
      url: "https://www.youtube.com/watch?v=CBdOA9MNuWs"
    },
    {
      name: "Walter D. Mignolo",
      title: t('ecofeminism.media.decolonial-thinking-and-doing.title'),
      description: t('ecofeminism.media.decolonial-thinking-and-doing.description'),
      type: "video",
      url: "https://www.youtube.com/watch?v=mI9F73wlMQE"
    }
  ];
  
  return (
    <>
      {/* Ensure translations are loaded */}
      <TranslationLoader testKey="Navbar.ecofeminism" />
      
      <Head>
        <title>{t('ecofeminism.title')}</title>
        <meta 
          name="description" 
          content={t('ecofeminism.description')}
        />
      </Head>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            {t('ecofeminism.title')}
          </Typography>
          
          <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              {t('ecofeminism.what-is-ecofeminism.title')}
            </Typography>
            <Typography paragraph>
              {t('ecofeminism.what-is-ecofeminism.description')}
            </Typography>
            <Typography paragraph>
              {t('ecofeminism.what-is-ecofeminism.description-2')}
            </Typography>
          </Paper>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            {t('ecofeminism.key-concepts.title')}
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {resources.map((resource, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ height: 200 }}>
                    <StylizedImage
                      speciesName={resource.speciesName}
                      latinName={resource.latinName}
                      backgroundColor="#f8f5e6"
                      patternColor="#2e7d32"
                      pattern={resource.pattern as PatternType}
                      height="100%"
                      width="100%"
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {resource.title}
                    </Typography>
                    <Typography>
                      {resource.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            {t('ecofeminism.reading-recommendations.title')}
          </Typography>
          
          <Paper elevation={1} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <List>
              {readings.map((reading, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={<Typography variant="h6">{reading.title}</Typography>}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {reading.author}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {reading.description}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < readings.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            {t('ecofeminism.videos-and-podcasts.title')}
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {media.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom color="primary.main">
                      {item.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {item.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.type === 'video' 
                        ? t('ecofeminism.videos-and-podcasts.video') 
                        : t('ecofeminism.videos-and-podcasts.podcast')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      endIcon={<OpenInNewIcon fontSize="small" />}
                      component="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('ecofeminism.videos-and-podcasts.watch-listen')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            {t('ecofeminism.get-involved.title')}
          </Typography>
          
          <Paper elevation={1} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography paragraph>
              {t('ecofeminism.get-involved.description')}
            </Typography>
            <Typography>
              {t('ecofeminism.get-involved.contact-us')}
              {" "}
              <Link href="mailto:info@biotop-livada.si" underline="hover">
                info@biotop-livada.si
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
