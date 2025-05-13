import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import useTranslations from '../hooks/useTranslations';
import TranslationLoader from '../components/TranslationLoader';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip
} from '@mui/material';
import { 
  AccessTime as TimeIcon,
  Build as ToolsIcon,
  School as DifficultyIcon 
} from '@mui/icons-material';
import { StylizedImage } from '../components/StylizedImage';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the pattern type to match StylizedImage component
type PatternType = 'dots' | 'waves' | 'lines' | 'leaves';

// Define types for our instructables data
type InstructableItem = {
  title: {
    en: string;
    sl: string;
  };
  description: {
    en: string;
    sl: string;
  };
  difficulty: {
    en: string;
    sl: string;
  };
  time: {
    en: string;
    sl: string;
  };
  materials: {
    en: string;
    sl: string;
  };
  speciesName: {
    en: string;
    sl: string;
  };
  latinName: string;
  pattern: PatternType;
};

type InstructablesData = {
  title: string;
  description: {
    en: string;
    sl: string;
  };
  items: InstructableItem[];
};

// Get static props for the page
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'src/content/resources/instructables.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return {
    props: {
      instructablesData: data as InstructablesData
    }
  };
}

export default function Instructables({ instructablesData }: { instructablesData: InstructablesData }) {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  return (
    <>
      <Head>
        <title>{language === 'en' ? 'Instructables | The Livada Biotope' : 'Instructables | Biotop Livada'}</title>
        <meta
          name="description"
          content={language === 'en' 
            ? "Explore hands-on instructables from The Livada Biotope for youth and young adults, including decolonial composting, rainwater harvesting, and more." 
            : "Raziščite praktične instructables Biotopa Livada za mladino in mlade odrasle, vključno z dekolonialnim kompostiranjem, zbiranjem deževnice in več."}
        />
      </Head>

      <TranslationLoader />
      
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            {language === 'en' ? 'Instructables' : 'Instructables'}
          </Typography>
          
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" component="div" align="center" gutterBottom>
              {instructablesData.description[language]}
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {instructablesData.items.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  elevation={3}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8
                    }
                  }}
                >
                  <Box sx={{ height: 200, position: 'relative' }}>
                    <StylizedImage 
                      pattern={item.pattern}
                      speciesName={item.speciesName[language]}
                      latinName={item.latinName}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title[language]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.description[language]}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      <Chip 
                        icon={<DifficultyIcon />} 
                        label={item.difficulty[language]} 
                        variant="outlined" 
                        size="small" 
                      />
                      <Chip 
                        icon={<TimeIcon />} 
                        label={item.time[language]} 
                        variant="outlined" 
                        size="small" 
                      />
                      <Chip 
                        icon={<ToolsIcon />} 
                        label={item.materials[language]} 
                        variant="outlined" 
                        size="small" 
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      {language === 'en' ? 'Learn More' : 'Več'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
