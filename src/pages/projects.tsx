import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
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
import StylizedImage from '../components/StylizedImage';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
    {children}
  </Link>
);

export default function Projects() {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  const projects = [
    {
      title: language === 'en' ? 'Let\'s Not Dry Out The Future' : 'Ne izsušimo prihodnosti',
      description: language === 'en' 
        ? 'A project focused on monitoring soil moisture to prevent drought and promote sustainable water usage.'
        : 'Projekt, osredotočen na spremljanje vlažnosti tal za preprečevanje suše in spodbujanje trajnostne rabe vode.',
      image: '/projects/lets-not-dry-out-the-future.jpg',
      slug: 'lets-not-dry-out-the-future',
    },
    {
      title: language === 'en' ? 'Urban Meadows Initiative' : 'Pobuda za urbane travnike',
      description: language === 'en'
        ? 'Transforming underutilized urban spaces into thriving meadow ecosystems that support pollinators and enhance biodiversity.'
        : 'Preoblikovanje premalo izkoriščenih urbanih prostorov v cvetoče travniške ekosisteme, ki podpirajo opraševalce in povečujejo biotsko raznovrstnost.',
      image: '/projects/urban-meadows.jpg',
      slug: 'urban-meadows',
    },
  ];

  return (
    <>
      {/* Use the simplified TranslationLoader */}
      <TranslationLoader />
      
      <Head>
        <title>Livada Biotope | {language === 'en' ? 'Our Projects' : 'Naši projekti'}</title>
        <meta 
          name="description" 
          content={language === 'en' 
            ? "Explore the various projects at Livada Biotope, from biodiversity monitoring to climate resilience initiatives." 
            : "Raziščite različne projekte v Biotopu Livada, od spremljanja biotske raznovrstnosti do pobud za podnebno odpornost."}
        />
      </Head>
      
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" component="nav">
              <StyledLink href="/">
                {language === 'en' ? 'Home' : 'Domov'}
              </StyledLink>
              {' / '}
              <Typography component="span" color="primary.main" fontWeight="medium" display="inline">
                {language === 'en' ? 'Projects' : 'Projekti'}
              </Typography>
            </Typography>
          </Box>
          
          <Paper elevation={2} sx={{ mb: 6, overflow: 'hidden' }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
                {language === 'en' ? 'Our Projects' : 'Naši projekti'}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {language === 'en'
                  ? 'At The Livada Biotope, we develop and implement ecological projects that address urban environmental challenges, with a special focus on biodiversity conservation and drought resilience.'
                  : 'V Biotopu Livada razvijamo in izvajamo ekološke projekte, ki obravnavajo urbane okoljske izzive, s posebnim poudarkom na ohranjanju biotske raznovrstnosti in odpornosti proti suši.'}
              </Typography>
            </Box>
          </Paper>
          
          <Grid container spacing={4}>
            {projects.map((project, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ height: 200, overflow: 'hidden' }}>
                    <StylizedImage 
                      speciesName={index === 0 
                        ? { en: "Common Reed", sl: "Navadni trst" } 
                        : index === 1 
                          ? { en: "Meadow Foxtail", sl: "Travniški lisičji rep" } 
                          : { en: "Yellow Flag Iris", sl: "Vodna perunika" }
                      }
                      latinName={index === 0 ? "Phragmites australis" : index === 1 ? "Alopecurus pratensis" : "Iris pseudacorus"}
                      backgroundColor="#f8f5e6"
                      patternColor="#2e7d32"
                      pattern={index === 0 ? "dots" : index === 1 ? "waves" : "lines"}
                      height="100%"
                      width="100%"
                      imageSrc={index === 0 ? "/images/illustrations/botanical-2.jpg" : index === 1 ? "/images/illustrations/botanical-3.jpg" : "/images/illustrations/botanical-4.jpg"}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom color="primary.main">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {project.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="outlined"
                      component={StyledLink}
                      href={`/projects/${project.slug}`}
                      sx={{ fontWeight: 'medium' }}
                    >
                      {language === 'en' ? 'Learn More' : 'Več informacij'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" color="primary.main" gutterBottom>
              {language === 'en' ? 'Have an Idea for a Project?' : 'Imate idejo za projekt?'}
            </Typography>
            <Typography variant="body1" paragraph>
              {language === 'en'
                ? 'We welcome collaboration with community members, researchers, and organizations. If you have an idea for an ecological project in Ljubljana, we\'d love to hear from you.'
                : 'Pozdravljamo sodelovanje s člani skupnosti, raziskovalci in organizacijami. Če imate idejo za ekološki projekt v Ljubljani, bi radi slišali od vas.'}
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              component={StyledLink}
              href="/contact"
              sx={{ mt: 2, fontWeight: 'medium' }}
            >
              {language === 'en' ? 'Contact Us' : 'Kontaktirajte nas'}
            </Button>
          </Box>
          
          <Divider sx={{ my: 6 }} />
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Livada Biotope {new Date().getFullYear()}
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
