import * as React from 'react';
import Head from 'next/head';
import BlogLayout from '../components/layout/BlogLayout';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import StylizedImage from '../components/StylizedImage';

// Featured post data with species information for StylizedImage
const featuredPost = {
  title: 'Biodiversity at The Livada Biotope',
  titleSl: 'Biotska raznovrstnost v Biotopu Livada',
  description: 'Explore the rich biodiversity we\'re monitoring and protecting through our community-driven ecological project at Livada.',
  descriptionSl: 'Raziščite bogato biotsko raznovrstnost, ki jo spremljamo in varujemo s pomočjo našega ekološkega projekta v Livadi.',
  species: {
    name: {
      en: "Snake's Head Fritillary",
      sl: "Močvirski tulipan"
    },
    latin: "Fritillaria meleagris"
  },
  pattern: "dots" as "dots" | "waves" | "lines" | "leaves" | undefined,
  date: 'May 11, 2025',
  dateSl: '11. maj 2025'
};

// Recent posts data with species information for StylizedImage
const posts = [
  {
    title: 'European Nursery Web Spider Documented',
    titleSl: 'Dokumentiran evropski pajek dadilja',
    description: 'Our monitoring efforts captured images of the European Nursery Web spider in the Livada area.',
    descriptionSl: 'Naša prizadevanja za spremljanje so zajela slike evropskega pajka dadilja na območju Livade.',
    species: {
      name: {
        en: "European Nursery Web Spider",
        sl: "Navadni pisači pajek"
      },
      latin: "Pisaura mirabilis"
    },
    pattern: "waves" as "dots" | "waves" | "lines" | "leaves" | undefined,
    date: 'April 3, 2025',
    dateSl: '3. april 2025'
  },
  {
    title: 'Meadowsweet Blooming in Livada',
    titleSl: 'Cvetenje brestovolistnega oslada v Livadi',
    description: 'The beautiful Meadowsweet (Filipendula ulmaria) is now blooming in our biotope area.',
    descriptionSl: 'V našem območju biotopa zdaj cveti čudoviti brestovolistni oslad (Filipendula ulmaria).',
    species: {
      name: {
        en: "Meadowsweet",
        sl: "Močvirska brestovolistna sračica"
      },
      latin: "Filipendula ulmaria"
    },
    pattern: "lines" as "dots" | "waves" | "lines" | "leaves" | undefined,
    date: 'April 3, 2025',
    dateSl: '3. april 2025'
  },
  {
    title: 'Lesser Celandine Population Growth',
    titleSl: 'Rast populacije lopatičaste zlatice',
    description: 'We\'ve observed an increase in Lesser Celandine throughout the biotope this spring.',
    descriptionSl: 'To pomlad smo v biotopu opazili povečanje števila lopatičastih zlatice.',
    species: {
      name: {
        en: "Lesser Celandine",
        sl: "Lopotac"
      },
      latin: "Ficaria verna"
    },
    pattern: "dots" as "dots" | "waves" | "lines" | "leaves" | undefined,
    date: 'April 3, 2025',
    dateSl: '3. april 2025'
  },
  {
    title: 'Meadow Foxtail Monitoring',
    titleSl: 'Spremljanje travniškega lisičjega repa',
    description: 'Our latest observations of Meadow Foxtail (Alopecurus pratensis) in the Livada Biotope area.',
    descriptionSl: 'Naša najnovejša opažanja travniškega lisičjega repa (Alopecurus pratensis) na območju Livada Biotopa.',
    species: {
      name: "Meadow Foxtail",
      latin: "Alopecurus pratensis"
    },
    pattern: "waves",
    date: 'April 3, 2025',
    dateSl: '3. april 2025'
  },
];

function BlogPage() {
  const { language } = useLanguage();
  
  return (
    <>
      <Head>
        <title>{language === 'en' ? 'Blog | Livada Biotope' : 'Blog | Livada Biotop'}</title>
        <meta
          name="description"
          content={language === 'en' 
            ? 'Latest news and updates from the Livada Biotope project' 
            : 'Najnovejše novice in posodobitve iz projekta Livada Biotop'}
        />
      </Head>
      <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
        {/* Main featured post */}
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <Box sx={{ height: 240, display: { xs: 'none', sm: 'block' } }}>
            <StylizedImage 
              speciesName={featuredPost.species.name}
              latinName={featuredPost.species.latin}
              backgroundColor="#f8f5e6"
              patternColor="#2e7d32"
              pattern={featuredPost.pattern}
              height="100%"
              width="100%"
            />
          </Box>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                }}
              >
                <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                  {language === 'en' ? featuredPost.title : featuredPost.titleSl}
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  {language === 'en' ? featuredPost.description : featuredPost.descriptionSl}
                </Typography>
                <Typography variant="subtitle1" color="inherit">
                  {language === 'en' ? featuredPost.date : featuredPost.dateSl}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Recent posts */}
        <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 4, fontFamily: 'Georgia, serif' }}>
          {language === 'en' ? 'Recent Updates' : 'Nedavne posodobitve'}
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item key={post.title} xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component="a" href="#">
                  <Box sx={{ height: 240, display: { xs: 'none', sm: 'block' } }}>
                    <StylizedImage 
                      speciesName={post.species.name}
                      latinName={post.species.latin}
                      backgroundColor="#f8f5e6"
                      patternColor="#2e7d32"
                      pattern={post.pattern as "dots" | "waves" | "lines" | "leaves" | undefined}
                      height="100%"
                      width="100%"
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {language === 'en' ? post.title : post.titleSl}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {language === 'en' ? post.date : post.dateSl}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {language === 'en' ? post.description : post.descriptionSl}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

// Define a custom layout for this page
BlogPage.getLayout = function getLayout(page: React.ReactNode) {
  return <BlogLayout>{page}</BlogLayout>;
};

export default BlogPage;
