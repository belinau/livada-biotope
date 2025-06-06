import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useLanguage } from '../contexts/LanguageContext';

import TranslationLoader from '../components/TranslationLoader';
import StylizedImage from '../components/StylizedImage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


// Define types for our data
interface Resource {
  titleEn: string;
  titleSl: string;
  descriptionEn: string;
  descriptionSl: string;
  speciesNameEn: string;
  speciesNameSl: string;
  latinName: string;
  pattern: 'dots' | 'waves' | 'lines' | 'leaves';
}

interface Reading {
  title: string;
  titleSl: string;
  author: string;
  descriptionEn: string;
  descriptionSl: string;
  url: string;
}

interface Media {
  name: string;
  titleEn: string;
  titleSl: string;
  descriptionEn: string;
  descriptionSl: string;
  type: 'video' | 'podcast';
  url: string;
}

interface EcofeminismData {
  title: string;
  titleSl: string;
  description: string;
  descriptionSl: string;
  introEn: string;
  introSl: string;
  introSecondEn: string;
  introSecondSl: string;
  resources: Resource[];
  readings: Reading[];
  media: Media[];
}

interface EcofeminismProps {
  data: EcofeminismData;
}

export default function Ecofeminism({ data }: EcofeminismProps) {
  const { language } = useLanguage();

  
  return (
    <>
      {/* Use the simplified TranslationLoader */}
      <TranslationLoader />
      
      <Head>
        <title>{language === 'en' ? data.title : data.titleSl} | {language === 'en' ? 'The Livada Biotope' : 'Biotop Livada'}</title>
        <meta 
          name="description" 
          content={language === 'en' ? data.description : data.descriptionSl}
        />
      </Head>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            {language === 'en' ? data.title : data.titleSl}
          </Typography>
          
          <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
              {language === 'en' ? 'What is Ecofeminism?' : 'Kaj je ekofeminizem?'}
            </Typography>
            <Typography paragraph>
              {language === 'en' ? data.introEn : data.introSl}
            </Typography>
            <Typography paragraph>
              {language === 'en' ? data.introSecondEn : data.introSecondSl}
            </Typography>
          </Paper>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
            {language === 'en' ? 'Key Concepts' : 'Ključni koncepti'}
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 6 }}>
            {data.resources.map((resource, index) => (
              <Box key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ height: 200 }}>
                    <StylizedImage
                      speciesName={{
                        en: resource.speciesNameEn,
                        sl: resource.speciesNameSl
                      }}
                      latinName={resource.latinName}
                      pattern={resource.pattern}
                      backgroundColor="#f8f5e6"
                      patternColor="#2e7d32"
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                      {language === 'en' ? resource.titleEn : resource.titleSl}
                    </Typography>
                    <Typography>
                      {language === 'en' ? resource.descriptionEn : resource.descriptionSl}
                    </Typography>
                  </CardContent>
                </Card>
             </Box>
            ))}
         </Box>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
            {language === 'en' ? 'Reading Recommendations' : 'Priporočeno branje'}
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 6 }}>
            {data.readings.map((reading, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                      {language === 'en' ? reading.title : reading.titleSl}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {reading.author}
                    </Typography>
                    <Typography paragraph>
                      {language === 'en' ? reading.descriptionEn : reading.descriptionSl}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      endIcon={<OpenInNewIcon />}
                      component="a"
                      href={reading.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {language === 'en' ? 'Learn More' : 'Več informacij'}
                    </Button>
                  </CardActions>
                </Card>
             </Box>
            ))}
         </Box>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
            {language === 'en' ? 'Videos & Podcasts' : 'Videi in podkasti'}
          </Typography>
          
          <List sx={{ mb: 6 }}>
            {data.media.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                        {item.name}: {language === 'en' ? item.titleEn : item.titleSl}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block', my: 1 }}>
                          {language === 'en' ? item.descriptionEn : item.descriptionSl}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          {language === 'en' ? 
                            `Type: ${item.type === 'video' ? 'Video' : 'Podcast'}` : 
                            `Tip: ${item.type === 'video' ? 'Video' : 'Podkast'}`
                          }
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          endIcon={<OpenInNewIcon />}
                          component="a"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {language === 'en' ? 'Watch/Listen' : 'Oglej si/Poslušaj'}
                        </Button>
                      </>
                    }
                  />
                </ListItem>
                {index < data.media.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Container>
    </>
  );
}

// This function gets called at build time on server-side
export const getStaticProps: GetStaticProps = async () => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const matter = (await import('gray-matter')).default;
    
    const filePath = path.join(process.cwd(), 'src/content/resources/ecofeminism.md');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    // Ensure all required fields have default values
    const defaultData: EcofeminismData = {
      title: 'Ecofeminism',
      titleSl: 'Ekofeminizem',
      description: 'Exploring the connections between ecology and feminism',
      descriptionSl: 'Raziskovanje povezav med ekologijo in feminizmom',
      introEn: '',
      introSl: '',
      introSecondEn: '',
      introSecondSl: '',
      resources: [],
      readings: [],
      media: []
    };
    
    const ecofeminismData: EcofeminismData = {
      ...defaultData,
      ...data,
      resources: data.resources || [],
      readings: data.readings || [],
      media: data.media || []
    };
    
    return {
      props: {
        data: ecofeminismData
      },
      revalidate: 3600 // Revalidate at most once per hour
    };
  } catch (error) {
    console.error('Error loading ecofeminism page content:', error);
    return {
      props: {
        data: {
          title: 'Ecofeminism',
          titleSl: 'Ekofeminizem',
          description: 'Error loading content. Please try again later.',
          descriptionSl: 'Napaka pri nalaganju vsebine. Poskusite znova kasneje.',
          introEn: 'Error loading content. Please try again later.',
          introSl: 'Napaka pri nalaganju vsebine. Poskusite znova kasneje.',
          introSecondEn: '',
          introSecondSl: '',
          resources: [],
          readings: [],
          media: []
        }
      },
      revalidate: 60 // Retry after 1 minute on error
    };
  }
};
