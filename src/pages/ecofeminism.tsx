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
      title: "Staying with the Trouble",
      author: "Donna Haraway",
      description: language === 'en' 
        ? "Making kin in the Chthulucene - explores multispecies flourishing on a damaged planet." 
        : "Ustvarjanje sorodstva v Htulucenu - raziskuje razcvet več vrst na poškodovanem planetu."
    },
    {
      title: language === 'en' ? "Braiding Sweetgrass" : "Pletenje sladke trave",
      author: "Robin Wall Kimmerer",
      description: language === 'en' 
        ? "Indigenous wisdom, scientific knowledge, and the teachings of plants." 
        : "Domorodno znanje, znanstvena spoznanja in učenja rastlin."
    },
    {
      title: language === 'en' ? "The Mushroom at the End of the World" : "Goba na koncu sveta",
      author: "Anna Lowenhaupt Tsing",
      description: language === 'en' 
        ? "On the possibility of life in capitalist ruins." 
        : "O možnosti življenja v kapitalističnih ruševinah."
    }
  ];
  
  // Videos and podcasts
  const media = [
    {
      name: "Donna Haraway",
      title: language === 'en' ? "Staying with the Trouble: Making Kin in the Chthulucene" : "Ostati s težavo: Ustvarjanje sorodstva v Htulucenu",
      description: language === 'en' 
        ? "Donna Haraway discusses multispecies flourishing on a damaged planet and proposes new ways of living and dying together on Earth during environmentally challenging times." 
        : "Donna Haraway razpravlja o razcvetu več vrst na poškodovanem planetu in predlaga nove načine skupnega življenja in umiranja na Zemlji v okoljsko zahtevnih časih.",
      type: "video",
      url: "https://www.youtube.com/watch?v=GrYA7sMQaBQ"
    },
    {
      name: "Bayo Akomolafe",
      title: language === 'en' ? "Post-Activism and Decolonial Fugitivity" : "Post-aktivizem in dekolonialna bežnost",
      description: language === 'en' 
        ? "Bayo Akomolafe challenges conventional approaches to climate change and social justice, suggesting that 'the times are urgent, let us slow down.'" 
        : "Bayo Akomolafe izziva konvencionalne pristope k podnebnim spremembam in socialni pravičnosti ter predlaga, da 'so časi nujni, zato se upočasnimo.'",
      type: "video",
      url: "https://www.youtube.com/watch?v=pRFVJ5OoH_A"
    },
    {
      name: "Bojana Kunst",
      title: language === 'en' ? "The Life of Art: Transversal Lines of Care" : "Življenje umetnosti: prečne črte skrbi",
      description: language === 'en' 
        ? "Bojana Kunst explores the ethics of care in artistic practices and how art can create transversal connections that challenge institutional boundaries and foster new forms of solidarity." 
        : "Bojana Kunst raziskuje etiko skrbi v umetniških praksah in kako lahko umetnost ustvari prečne povezave, ki izzivajo institucionalne meje in spodbujajo nove oblike solidarnosti.",
      type: "video",
      url: "https://intima.org/kunst/zivljenje/index.html"
    },
    {
      name: "Sophie Strand",
      title: language === 'en' ? "The Ecology of Story" : "Ekologija zgodbe",
      description: language === 'en' 
        ? "Sophie Strand weaves together mythology, ecology, and embodied storytelling to create a mycelial approach to narrative that honors multispecies relationships and the more-than-human world." 
        : "Sophie Strand prepleta mitologijo, ekologijo in utelešeno pripovedovanje zgodb, da bi ustvarila micelijski pristop k pripovedi, ki spoštuje medvrstne odnose in več-kot-človeški svet.",
      type: "video",
      url: "https://www.youtube.com/watch?v=VtJ5EUxycCw"
    },
    {
      name: "Merlin Sheldrake",
      title: language === 'en' ? "Entangled Life: How Fungi Make Our Worlds" : "Prepleteno življenje: Kako glive ustvarjajo naše svetove",
      description: language === 'en' 
        ? "Merlin Sheldrake explores the fascinating and often overlooked world of fungi, revealing how these remarkable organisms challenge our understanding of individuality and connection." 
        : "Merlin Sheldrake raziskuje fascinanten in pogosto spregledan svet gliv ter razkriva, kako ti izjemni organizmi izzivajo naše razumevanje individualnosti in povezanosti.",
      type: "podcast",
      url: "https://www.youtube.com/watch?v=LLrTPrp-fW8"
    },
    {
      name: "Aníbal Quijano",
      title: language === 'en' ? "Coloniality of Power and Eurocentrism" : "Kolonialnost moči in eurocentrizem",
      description: language === 'en' 
        ? "Aníbal Quijano introduces his groundbreaking concept of the 'coloniality of power' which explains how colonial hierarchies of race, labor, and knowledge persist in our supposedly postcolonial world." 
        : "Aníbal Quijano predstavlja svoj prelomni koncept 'kolonialnosti moči', ki pojasnjuje, kako kolonialne hierarhije rase, dela in znanja vztrajajo v našem domnevno postkolonialnem svetu.",
      type: "video",
      url: "https://www.youtube.com/watch?v=CBdOA9MNuWs"
    },
    {
      name: "Walter D. Mignolo",
      title: language === 'en' ? "Decolonial Thinking and Doing" : "Dekolonialno mišljenje in delovanje",
      description: language === 'en' 
        ? "Walter D. Mignolo discusses decolonial thinking as a path toward epistemic disobedience and delinking from Western epistemology to create pluriversal knowledge systems." 
        : "Walter D. Mignolo razpravlja o dekolonialnem mišljenju kot poti k epistemski neposlušnosti in odcepitvi od zahodne epistemologije za ustvarjanje pluriverzalnih sistemov znanja.",
      type: "video",
      url: "https://www.youtube.com/watch?v=mI9F73wlMQE"
    }
  ];
  
  return (
    <>
      <Head>
        <title>{language === 'en' ? 'Ecofeminist Resources | The Livada Biotope' : 'Ekofeminističi viri | Biotop Livada'}</title>
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
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
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
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
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
            {language === 'en' ? 'Videos & Podcasts' : 'Videi in podkasti'}
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
                        ? (language === 'en' ? 'Video' : 'Video') 
                        : (language === 'en' ? 'Podcast' : 'Podkast')}
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
                      {language === 'en' ? 'Watch/Listen' : 'Oglej si/Poslušaj'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            {language === 'en' ? 'Get Involved' : 'Vključi se'}
          </Typography>
          
          <Paper elevation={1} sx={{ p: 4, mb: 6, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography paragraph>
              {language === 'en' 
                ? "Interested in exploring these concepts further? Join our workshops, reading groups, and community conversations at The Livada Biotope." 
                : "Vas zanima nadaljnje raziskovanje teh konceptov? Pridružite se našim delavnicam, bralnim skupinam in pogovorom skupnosti v Biotopu Livada."}
            </Typography>
            <Typography>
              {language === 'en' 
                ? "Contact us to learn more about upcoming events and how you can participate." 
                : "Kontaktirajte nas, da izveste več o prihajajočih dogodkih in o tem, kako lahko sodelujete."}
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
