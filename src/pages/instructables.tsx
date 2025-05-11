import React from 'react';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import StylizedImage from '../components/StylizedImage';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function Instructables() {
  const { language } = useLanguage();
  
  // Define the pattern type to match StylizedImage component
  type PatternType = 'dots' | 'waves' | 'lines' | 'leaves';
  
  // Instructables data
  const instructables = [
    {
      title: language === 'en' ? 'Decolonial Composting' : 'Dekolonialno kompostiranje',
      description: language === 'en' 
        ? "Learn how to create a compost system that honors diverse knowledge systems and reconnects with ancestral practices of soil care." 
        : "Naučite se ustvariti sistem kompostiranja, ki spoštuje raznolike sisteme znanja in se ponovno poveže s predniškimi praksami skrbi za tla.",
      difficulty: language === 'en' ? 'Beginner' : 'Začetnik',
      time: language === 'en' ? '1-2 hours' : '1-2 uri',
      materials: language === 'en' ? 'Organic waste, garden space, tools' : 'Organski odpadki, vrtni prostor, orodja',
      speciesName: { en: "Common Compost Worm", sl: "Navadna kompostna glista" },
      latinName: "Eisenia fetida",
      pattern: "dots" as PatternType
    },
    {
      title: language === 'en' ? 'Medicinal Plant Garden' : 'Vrt zdravilnih rastlin',
      description: language === 'en' 
        ? "Design and grow a garden of medicinal plants that connects traditional knowledge with contemporary healing practices." 
        : "Oblikujte in gojite vrt zdravilnih rastlin, ki povezuje tradicionalno znanje s sodobnimi zdravilnimi praksami.",
      difficulty: language === 'en' ? 'Intermediate' : 'Srednje zahtevno',
      time: language === 'en' ? '3-4 hours' : '3-4 ure',
      materials: language === 'en' ? 'Plant seeds/seedlings, soil, garden space' : 'Semena/sadike rastlin, zemlja, vrtni prostor',
      speciesName: { en: "Chamomile", sl: "Kamilica" },
      latinName: "Matricaria chamomilla",
      pattern: "waves" as PatternType
    },
    {
      title: language === 'en' ? 'Rainwater Harvesting' : 'Zbiranje deževnice',
      description: language === 'en' 
        ? "Create a simple rainwater collection system to reduce water waste and care for drought-sensitive plants." 
        : "Ustvarite preprost sistem za zbiranje deževnice za zmanjšanje porabe vode in oskrbo rastlin, občutljivih na sušo.",
      difficulty: language === 'en' ? 'Beginner' : 'Začetnik',
      time: language === 'en' ? '2-3 hours' : '2-3 ure',
      materials: language === 'en' ? 'Barrels, gutters, pipes, tools' : 'Sodi, žlebovi, cevi, orodja',
      speciesName: { en: "Water Lily", sl: "Vodna lilija" },
      latinName: "Nymphaea",
      pattern: "lines" as PatternType
    },
    {
      title: language === 'en' ? 'Insect Hotel' : 'Hotel za žuželke',
      description: language === 'en' 
        ? "Build a shelter for beneficial insects to increase biodiversity and practice interspecies care in your garden." 
        : "Zgradite zavetje za koristne žuželke, da povečate biotsko raznovrstnost in prakticirate medvrstno skrb na svojem vrtu.",
      difficulty: language === 'en' ? 'Beginner' : 'Začetnik',
      time: language === 'en' ? '2-3 hours' : '2-3 ure',
      materials: language === 'en' ? 'Wood, bamboo, pine cones, straw, tools' : 'Les, bambus, borovi storži, slama, orodja',
      speciesName: { en: "Mason Bee", sl: "Zidarska čebela" },
      latinName: "Osmia bicornis",
      pattern: "dots" as PatternType
    },
    {
      title: language === 'en' ? 'Seed Saving Workshop' : 'Delavnica shranjevanja semen',
      description: language === 'en' 
        ? "Learn how to collect, clean, and store seeds from your garden to preserve biodiversity and build seed sovereignty." 
        : "Naučite se zbirati, čistiti in shranjevati semena iz vašega vrta za ohranjanje biotske raznovrstnosti in gradnjo suverenosti semen.",
      difficulty: language === 'en' ? 'Intermediate' : 'Srednje zahtevno',
      time: language === 'en' ? '2-3 hours' : '2-3 ure',
      materials: language === 'en' ? 'Garden plants with mature seeds, jars, paper bags, labels' : 'Vrtne rastline z zrelimi semeni, kozarci, papirnate vrečke, nalepke',
      speciesName: { en: "Sunflower", sl: "Sončnica" },
      latinName: "Helianthus annuus",
      pattern: "leaves" as PatternType
    },
    {
      title: language === 'en' ? 'Natural Dyes Workshop' : 'Delavnica naravnih barv',
      description: language === 'en' 
        ? "Create your own plant-based dyes using local materials and learn about the cultural histories of color." 
        : "Ustvarite lastne rastlinske barve z uporabo lokalnih materialov in spoznajte kulturne zgodovine barv.",
      difficulty: language === 'en' ? 'Intermediate' : 'Srednje zahtevno',
      time: language === 'en' ? '3-4 hours' : '3-4 ure',
      materials: language === 'en' ? 'Plant materials, fabric, mordants, pots' : 'Rastlinski materiali, tkanina, fiksirji, lonci',
      speciesName: { en: "Woad", sl: "Silina" },
      latinName: "Isatis tinctoria",
      pattern: "waves" as PatternType
    }
  ];
  
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
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            {language === 'en' ? 'Instructables' : 'Instructables'}
          </Typography>
          
          <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              {language === 'en' ? 'DIY Guides for Ecological Living' : 'DIY vodniki za ekološko življenje'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "Welcome to our collection of hands-on guides for practical ecological action! These instructables are designed specifically for youth and young adults who want to make a difference through tangible, creative projects." 
                : "Dobrodošli v naši zbirki praktičnih vodnikov za ekološko delovanje! Ti instructables so zasnovani posebej za mladino in mlade odrasle, ki želijo narediti razliko s konkretnimi, ustvarjalnimi projekti."}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "Each guide is rooted in our principles of interspecies kinship, decolonial approaches to nature, and care for the more-than-human world. These aren't just environmental projects—they're invitations to reimagine your relationship with the living world around you." 
                : "Vsak vodnik temelji na naših načelih medvrstne sorodnosti, dekolonialnih pristopih k naravi in skrbi za več-kot-človeški svet. To niso le okoljski projekti—so vabila k ponovnemu zamišljanju vašega odnosa z živim svetom okoli vas."}
            </Typography>
          </Paper>
          
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {instructables.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea>
                    <Box sx={{ height: 200 }}>
                      <StylizedImage
                        speciesName={item.speciesName}
                        latinName={item.latinName}
                        backgroundColor="#f8f5e6"
                        patternColor="#2e7d32"
                        pattern={item.pattern as PatternType}
                        height="100%"
                        width="100%"
                      />
                    </Box>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {item.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip label={item.difficulty} size="small" color="primary" variant="outlined" />
                        <Chip label={item.time} size="small" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{language === 'en' ? 'Materials:' : 'Materiali:'}</strong> {item.materials}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions sx={{ mt: 'auto' }}>
                    <Button size="small" color="primary">
                      {language === 'en' ? 'View Instructions' : 'Prikaži instructable'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Paper elevation={1} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              {language === 'en' ? 'Workshop Opportunities' : 'Priložnosti za delavnice'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "Want to learn these skills in person? Join one of our regular workshops at The Livada Biotope where we offer hands-on guidance for all these projects and more." 
                : "Želite se naučiti teh veščin osebno? Pridružite se eni od naših rednih delavnic v Biotopu Livada, kjer ponujamo praktično vodenje za vse te projekte in več."}
            </Typography>
            <Button variant="contained" color="primary">
              {language === 'en' ? 'Upcoming Workshops' : 'Prihajajoče delavnice'}
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
