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
import StylizedImage from '../components/StylizedImage';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the pattern type to match StylizedImage component
type PatternType = 'dots' | 'waves' | 'lines' | 'leaves';

// Define types for our instructables data
type Guide = {
  title_en: string;
  title_sl: string;
  description_en: string;
  description_sl: string;
  difficulty: string;
  time: string;
  image?: string;
  steps: Array<{
    step_en: string;
    step_sl: string;
    image?: string;
  }>;
};

type InstructablesData = {
  title_en: string;
  title_sl: string;
  intro_en: string;
  intro_sl: string;
  guides: Guide[];
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
  
  // Helper function to get the appropriate language content
  const getLangContent = (en: string, sl: string) => language === 'en' ? en : sl;
  
  return (
    <>
      <Head>
        <title>{getLangContent('Instructables | The Livada Biotope', 'Priročniki | Biotop Livada')}</title>
        <meta
          name="description"
          content={getLangContent(
            "Explore hands-on instructables from The Livada Biotope for youth and young adults, including decolonial composting, rainwater harvesting, and more.", 
            "Raziščite praktične priročnike Biotopa Livada za mladino in mlade odrasle, vključno z dekolonialnim kompostiranjem, zbiranjem deževnice in več."
          )}
        />
      </Head>

      <TranslationLoader />
      
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            {getLangContent(instructablesData.title_en, instructablesData.title_sl)}
          </Typography>
          
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" component="div" align="center" gutterBottom>
              {getLangContent(instructablesData.intro_en, instructablesData.intro_sl)}
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {instructablesData.guides.map((guide, index) => (
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
                      pattern={['dots', 'waves', 'lines', 'leaves'][index % 4] as PatternType}
                      speciesName={getLangContent(guide.title_en, guide.title_sl)}
                      latinName=""
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {getLangContent(guide.title_en, guide.title_sl)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {getLangContent(guide.description_en, guide.description_sl)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      <Chip 
                        icon={<DifficultyIcon />} 
                        label={guide.difficulty} 
                        variant="outlined" 
                        size="small" 
                      />
                      <Chip 
                        icon={<TimeIcon />} 
                        label={guide.time} 
                        variant="outlined" 
                        size="small" 
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      {getLangContent('Learn More', 'Več')}
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
