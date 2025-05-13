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
      title: language === 'en' ? 'Decolonial Composting' : 'Dekolonialno kompostiranje',
      description: language === 'en' 
        ? "Decolonial composting recognizes that our relationship with soil, waste, and regeneration is deeply political. It invites us to question dominant Western approaches to environmental management and instead embrace diverse knowledge systems and practices." 
        : "Dekolonialno kompostiranje prepoznava, da je naš odnos do tal, odpadkov in regeneracije globoko političen. Vabi nas, da podvomimo o prevladujočih zahodnih pristopih k upravljanju okolja in namesto tega sprejmemo raznolike sisteme znanja in prakse.",
      speciesName: { en: "Earthworm", sl: "Deževnik" },
      latinName: "Lumbricus terrestris",
      pattern: "dots" as PatternType
    },
    {
      title: language === 'en' ? 'Interspecies Solidarity' : 'Medvrstna solidarnost',
      description: language === 'en' 
        ? "Moving beyond anthropocentrism, interspecies solidarity recognizes the agency, sentience, and rights of non-human beings. It challenges us to see other species not as resources to be managed but as communities with whom we share mutual dependencies and responsibilities." 
        : "Medvrstna solidarnost, ki presega antropocentrizem, priznava avtonomijo, zavedanje in pravice nečloveških bitij. Spodbuja nas, da drugih vrst ne vidimo kot vire, ki jih je treba upravljati, temveč kot skupnosti, s katerimi si delimo medsebojne odvisnosti in odgovornosti.",
      speciesName: { en: "Honey Bee", sl: "Medonosna čebela" },
      latinName: "Apis mellifera",
      pattern: "waves" as PatternType
    },
    {
      title: language === 'en' ? 'Care Politics' : 'Politika skrbi',
      description: language === 'en' 
        ? "Centering care in our political imagination helps us move beyond extractive relationships. Care politics recognizes the essential work of maintaining, continuing, and repairing our world – work that has historically been feminized, devalued, and often made invisible." 
        : "Osredotočanje skrbi v naši politični domišljiji nam pomaga preseči ekstraktivne odnose. Politika skrbi prepoznava bistveno delo vzdrževanja, nadaljevanja in popravljanja našega sveta – delo, ki je bilo zgodovinsko feminizirano, razvrednoteno in pogosto nevidno.",
      speciesName: { en: "Medicinal Sage", sl: "Žajbelj" },
      latinName: "Salvia officinalis",
      pattern: "leaves" as PatternType
    }
  ];
  
  // Reading recommendations
  const readings = [
    {
      title: language === 'en' ? 'Staying with the Trouble' : 'Ostati pri težavah',
      author: "Donna Haraway",
      description: language === 'en' 
        ? "In the midst of spiraling ecological devastation, multispecies feminist theorist Donna Haraway offers a rallying cry for making kin in the Chthulucene." 
        : "V središču spiraločega ekološkega uničenja ponuja multispekcijska feministična teoretičarka Donna Haraway klic k združevanju v Chthulucenu."
    },
    {
      title: language === 'en' ? 'Braiding Sweetgrass' : 'Pletenje sladke trave',
      author: "Robin Wall Kimmerer",
      description: language === 'en' 
        ? "As a botanist, Robin Wall Kimmerer has been trained to ask questions of nature with the tools of science. As a member of the Citizen Potawatomi Nation, she embraces indigenous teachings that consider plants and animals to be our oldest teachers." 
        : "Kot botaničarka je Robin Wall Kimmerer bila usposobljena, da naravi postavlja vprašanja s pomočjo znanosti. Kot članica naroda Citizen Potawatomi sprejema starodavna učenja, ki štejejo rastline in živali za naše najstarejše učitelje."
    },
    {
      title: language === 'en' ? 'The Mushroom at the End of the World' : 'Goban na koncu sveta',
      author: "Anna Lowenhaupt Tsing",
      description: language === 'en' 
        ? "The Mushroom at the End of the World is a timely and fascinating exploration of the relationship between capitalist destruction and collaborative survival within multispecies landscapes." 
        : "Goban na koncu sveta je pravočasna in zanimiva raziskava odnosa med kapitalističnim uničenjem in sodelovalnim preživetjem v pokrajini več vrst."
    }
  ];
  
  // Videos and podcasts
  const media = [
    {
      name: "Donna Haraway",
      title: language === 'en' ? 'Staying with the Trouble' : 'Ostati pri težavah',
      description: language === 'en' 
        ? "In the midst of spiraling ecological devastation, multispecies feminist theorist Donna Haraway offers a rallying cry for making kin in the Chthulucene." 
        : "V središču spiraločega ekološkega uničenja ponuja multispekcijska feministična teoretičarka Donna Haraway klic k združevanju v Chthulucenu.",
      type: "video",
      url: "https://www.youtube.com/watch?v=GrYA7sMQaBQ"
    },
    {
      name: "Bayo Akomolafe",
      title: language === 'en' ? 'Post-Activism and Decolonial Fugitivity' : 'Post-aktivizem in dekolonialna begavščina',
      description: language === 'en' 
        ? "Bayo Akomolafe explores the possibilities of post-activism and decolonial fugitivity in the face of climate change and social injustice." 
        : "Bayo Akomolafe raziskuje možnosti post-aktivizma in dekolonialne begavščine v času podnebnih sprememb in socialne nepravičnosti.",
      type: "video",
      url: "https://www.youtube.com/watch?v=pRFVJ5OoH_A"
    },
    {
      name: "Bojana Kunst",
      title: language === 'en' ? 'The Life of Art' : 'Življenje umetnosti',
      description: language === 'en' 
        ? "Bojana Kunst explores the relationship between art, life, and politics in the context of contemporary capitalism." 
        : "Bojana Kunst raziskuje odnos med umetnostjo, življenjem in politiko v okviru sodobnega kapitalizma.",
      type: "video",
      url: "https://intima.org/kunst/zivljenje/index.html"
    },
    {
      name: "Sophie Strand",
      title: language === 'en' ? 'The Ecology of Story' : 'Ekologija zgodbe',
      description: language === 'en' 
        ? "Sophie Strand explores the relationship between storytelling, ecology, and social justice." 
        : "Sophie Strand raziskuje odnos med pripovedovanjem, ekologijo in socialno pravičnostjo.",
      type: "video",
      url: "https://www.youtube.com/watch?v=VtJ5EUxycCw"
    },
    {
      name: "Merlin Sheldrake",
      title: language === 'en' ? 'Entangled Life' : 'Zapleteno življenje',
      description: language === 'en' 
        ? "Merlin Sheldrake explores the fascinating world of fungi and their relationships with other organisms." 
        : "Merlin Sheldrake raziskuje zanimiv svet gliv in njihove odnose z drugimi organizmi.",
      type: "podcast",
      url: "https://www.youtube.com/watch?v=LLrTPrp-fW8"
    },
    {
      name: "Aníbal Quijano",
      title: language === 'en' ? 'Coloniality of Power and Eurocentrism' : 'Kolonialnost moči in evrocentrizem',
      description: language === 'en' 
        ? "Aníbal Quijano explores the relationship between coloniality, power, and Eurocentrism in the context of contemporary capitalism." 
        : "Aníbal Quijano raziskuje odnos med kolonialnostjo, močjo in evrocentrizmom v okviru sodobnega kapitalizma.",
      type: "video",
      url: "https://www.youtube.com/watch?v=CBdOA9MNuWs"
    },
    {
      name: "Walter D. Mignolo",
      title: language === 'en' ? 'Decolonial Thinking and Doing' : 'Dekolonialno mišljenje in delo',
      description: language === 'en' 
        ? "Walter D. Mignolo explores the possibilities of decolonial thinking and doing in the face of coloniality and capitalism." 
        : "Walter D. Mignolo raziskuje možnosti dekolonialnega mišljenja in dela v času kolonialnosti in kapitalizma.",
      type: "video",
      url: "https://www.youtube.com/watch?v=mI9F73wlMQE"
    }
  ];
  
  return (
    <>
      {/* Use the simplified TranslationLoader */}
      <TranslationLoader />
      
      <Head>
        <title>{language === 'en' ? 'Ecofeminist Resources | The Livada Biotope' : 'Ekofeministični viri | Biotop Livada'}</title>
        <meta 
          name="description" 
          content={language === 'en' 
            ? "Explore ecofeminist perspectives and resources at The Livada Biotope, including decolonial composting, interspecies kinship, and more-than-human approaches." 
            : "Raziščite ekofeminističe perspektive in vire v Biotopu Livada, vključno z dekolonialnim kompostiranjem, medvrstno sorodnostjo in več-kot-človeškim pristopom."}
        />
      </Head>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            {language === 'en' ? 'Ecofeminist Resources' : 'Ekofeministični viri'}
          </Typography>
          
          <Paper elevation={0} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
              {language === 'en' ? 'What is Ecofeminism?' : 'Kaj je ekofeminizem?'}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "Ecofeminism connects the oppression of women and marginalized communities with the exploitation of the environment. It recognizes that environmental destruction, colonialism, racism, and patriarchy are interconnected systems of domination that must be challenged together." 
                : "Ekofeminizem povezuje zatiranje žensk in marginaliziranih skupnosti z izkoriščanjem okolja. Prepoznava, da so uničevanje okolja, kolonializem, rasizem in patriarhat medsebojno povezani sistemi prevlade, ki jih je treba izzvati skupaj."}
            </Typography>
            <Typography paragraph>
              {language === 'en' 
                ? "At The Livada Biotope, we approach our work through an ecofeminist lens, centering care, reciprocity, and multispecies justice in all that we do. We believe that building a more sustainable future requires addressing social and environmental issues together, not as separate concerns." 
                : "V Biotopu Livada pristopamo k našemu delu skozi ekofeministični pogled, v središču pa so skrb, vzajemnost in pravičnost za več vrst pri vsem, kar počnemo. Verjamemo, da izgradnja bolj trajnostne prihodnosti zahteva reševanje družbenih in okoljskih vprašanj skupaj, ne kot ločene zadeve."}
            </Typography>
          </Paper>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
            {language === 'en' ? 'Key Concepts' : 'Ključni koncepti'}
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
            {language === 'en' ? 'Reading Recommendations' : 'Priporočila za branje'}
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
            {language === 'en' ? 'Videos and Podcasts' : 'Videi in podcasti'}
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
                        ? language === 'en' ? 'Video' : 'Video' 
                        : language === 'en' ? 'Podcast' : 'Podcast'}
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
                      {language === 'en' ? 'Watch/Listen' : 'Oglej/Pošlji'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            {language === 'en' ? 'Get Involved' : 'Pridružite se'}
          </Typography>
          
          <Paper elevation={1} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography paragraph>
              {language === 'en' 
                ? "We invite you to join us in our mission to create a more just and sustainable world. Contact us to learn more about our work and how you can get involved." 
                : "Vabimo vas, da se nam pridružite v naši misiji ustvarjanja bolj pravičnega in trajnostnega sveta. Pišite nam, da se izveste več o našem delu in kako se lahko vključite."}
            </Typography>
            <Typography>
              {language === 'en' ? 'Contact us' : 'Pišite nam'} 
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
