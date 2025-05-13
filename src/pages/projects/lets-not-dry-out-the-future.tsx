import React from 'react';
import SharedLayout from '@/components/layout/SharedLayout';
import { SensorVisualization } from '@/components/features/SensorVisualization';
import BiodiversityShowcase from '@/components/features/BiodiversityShowcase';
import StylizedImage from '@/components/StylizedImage';
import Image from 'next/image';
import { getBotanicalIllustrations, getZoologicalIllustrations } from '@/lib/illustrationsData';
import { biodiversityItems } from '@/lib/biodiversityData';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import TranslationLoader from '@/components/TranslationLoader';
import Link from 'next/link';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Card,
  CardContent,
  Divider,
  Button,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';

export default function LetsNotDryOutTheFuture() {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const theme = useTheme();
  const botanicalIllustrations = getBotanicalIllustrations();
  const zoologicalIllustrations = getZoologicalIllustrations();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Use the simplified TranslationLoader */}
        <TranslationLoader />
        
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ 
            color: 'primary.main', 
            mb: 2,
            fontWeight: 700 
          }}>
            {language === 'en' ? "Let's Not Dry Out The Future" : "Ne izsušimo prihodnosti"}
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary' }}>
            {language === 'en' 
              ? "A project focused on monitoring soil moisture to prevent drought and promote sustainable water usage."
              : "Projekt, osredotočen na spremljanje vlažnosti tal za preprečevanje suše in spodbujanje trajnostne rabe vode."}
          </Typography>
        </Box>
        


        {/* Section: Sensor Data */}
        <Box sx={{ mb: 8 }}>
          {/* Sensor Content */}
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.dark', fontWeight: 600 }}>
            {language === 'en' ? "Soil Moisture Monitoring" : "Spremljanje vlažnosti tal"}
          </Typography>
          
          <SensorVisualization />
        </Box>
        
        {/* Section: Climate Change */}
        <Box sx={{ mb: 8, mt: 12 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.dark', fontWeight: 600 }}>
            {language === 'en' ? "Climate Change" : "Podnebne spremembe"}
          </Typography>
          {/* Climate Change Tab Content */}
          <Typography paragraph sx={{ mb: 3 }}>
            {language === 'en' 
              ? "Drought is a growing concern globally as climate change alters precipitation patterns and increases temperatures. This project aims to monitor soil moisture levels and develop strategies for drought resilience."
              : "Suša je vse večja skrb po vsem svetu, saj podnebne spremembe spreminjajo vzorce padavin in zvišujejo temperature. Ta projekt je namenjen spremljanju ravni vlažnosti tal in razvoju strategij za odpornost proti suši."}
          </Typography>
          <Typography paragraph sx={{ mb: 4 }}>
            {language === 'en'
              ? "The economic impact of drought can be severe, affecting agriculture, water supplies, and ecosystem health. By monitoring soil moisture, we can better prepare for and mitigate these impacts."
              : "Gospodarski vpliv suše je lahko hud in vpliva na kmetijstvo, oskrbo z vodo in zdravje ekosistemov. S spremljanjem vlažnosti tal se lahko bolje pripravimo na te vplive in jih ublažimo."}
          </Typography>

          <Paper 
            elevation={0} 
            sx={{ 
              my: 4, 
              p: 3, 
              bgcolor: 'rgba(46, 125, 50, 0.05)', 
              borderLeft: '4px solid', 
              borderColor: 'primary.main',
              borderRadius: 1
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 600 }}>Slovenia</Typography>
            <Typography paragraph sx={{ mb: 2 }}>
              {language === 'en'
                ? "Slovenia has experienced increasing drought frequency in recent years, with significant impacts on agriculture and water resources."
                : "Slovenija je v zadnjih letih doživela vse pogostejše suše, ki so pomembno vplivale na kmetijstvo in vodne vire."}
            </Typography>
            <Typography paragraph sx={{ mb: 2 }}>
              {language === 'en'
                ? "The geographical diversity of Slovenia means that drought impacts vary across regions, requiring localized monitoring and response strategies."
                : "Geografska raznolikost Slovenije pomeni, da se vplivi suše razlikujejo po regijah, kar zahteva lokalizirano spremljanje in strategije odzivanja."}
            </Typography>
            <Typography paragraph>
              {language === 'en'
                ? "Our project at Livada Biotope is developing a community-based approach to drought monitoring and response, focusing on sustainable water management practices."
                : "Naš projekt v Biotopu Livada razvija pristop k spremljanju suše in odzivanju nanjo, ki temelji na skupnosti, s poudarkom na trajnostnih praksah upravljanja z vodo."}
            </Typography>
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              my: 4, 
              p: 3, 
              bgcolor: 'rgba(46, 125, 50, 0.05)', 
              borderLeft: '4px solid', 
              borderColor: 'primary.main',
              borderRadius: 1
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 600 }}>Ljubljana</Typography>
            <Typography paragraph sx={{ mb: 2 }}>
              {language === 'en'
                ? "Ljubljana, the capital city of Slovenia, is also experiencing the impacts of drought, with a focus on urban adaptation and sustainable water management."
                : "Ljubljana, glavno mesto Slovenije, tudi doživlja vplive suše, s poudarkom na urbanem prilagajanju in trajnostnem upravljanju z vodo."}
            </Typography>
            <Typography paragraph sx={{ mb: 2 }}>
              {language === 'en'
                ? "The city is implementing measures to reduce water consumption and promote sustainable practices, such as rainwater harvesting and efficient irrigation systems."
                : "Mesto uveljavlja ukrepe za zmanjšanje porabe vode in spodbujanje trajnostnih praks, kot so zbiranje deževnice in učinkoviti sistemi namakanja."}
            </Typography>
            <Typography paragraph>
              {language === 'en'
                ? "Our project is working with the city to develop a comprehensive approach to drought management, including monitoring, education, and community engagement."
                : "Naš projekt sodeluje z mestom pri razvoju celostnega pristopa k upravljanju suše, vključno s spremljanjem, izobraževanjem in vključevanjem skupnosti."}
            </Typography>
          </Paper>

          <Typography variant="h5" sx={{ mt: 5, mb: 3, color: 'primary.dark', fontWeight: 600 }}>
            {language === 'en' ? "Consequences of Drought" : "Posledice suše"}
          </Typography>
          
          <List sx={{ mb: 4 }}>
            <ListItem 
              component={Paper} 
              elevation={1} 
              sx={{ mb: 2, p: 2, borderRadius: 1 }}
            >
              <Typography>
                {language === 'en' ? "Soil Cracks and Erosion" : "Razpoke in erozija tal"}
              </Typography>
            </ListItem>
            <ListItem 
              component={Paper} 
              elevation={1} 
              sx={{ mb: 2, p: 2, borderRadius: 1 }}
            >
              <Typography>
                {language === 'en' ? "Drying of Water Sources" : "Izsušitev vodnih virov"}
              </Typography>
            </ListItem>
            <ListItem 
              component={Paper} 
              elevation={1} 
              sx={{ p: 2, borderRadius: 1 }}
            >
              <Typography>
                {language === 'en' ? "Dust Storms and Air Pollution" : "Pihanje prahu in onesnaževanje zraka"}
              </Typography>
            </ListItem>
          </List>

          <Box sx={{ my: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'primary.dark', fontWeight: 600 }}>
              {language === 'en' ? "Selected Plant Species" : "Izbrane rastlinske vrste"}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ height: 240 }}>
                    <StylizedImage
                      speciesName={{
                        en: "Drought-Resistant Sage",
                        sl: "Sušo odporen žajbelj"
                      }}
                      latinName="Salvia officinalis"
                      backgroundColor="#f8f5e6"
                      patternColor="#2e7d32"
                      pattern="leaves"
                      height="100%"
                      width="100%"
                    />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                      {language === 'en' ? 'Mediterranean Herbs' : 'Sredozemske zelišča'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en' 
                        ? 'Herbs like sage, rosemary, and lavender have evolved to thrive in dry conditions with minimal water requirements.'
                        : 'Zelišča, kot so žajbelj, rožmarin in sivka, so se razvila tako, da uspevajo v suhih razmerah z minimalnimi potrebami po vodi.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ height: 240 }}>
                    <StylizedImage
                      speciesName={{
                        en: "Sedum",
                        sl: "Homulica"
                      }}
                      latinName="Sedum acre"
                      backgroundColor="#f8f5e6"
                      patternColor="#2e7d32"
                      pattern="dots"
                      height="100%"
                      width="100%"
                    />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                      {language === 'en' ? 'Succulent Ground Covers' : 'Sukulentne talne pokrivke'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en' 
                        ? 'Succulents like Sedum store water in their leaves and require minimal irrigation, making them perfect for drought-prone areas.'
                        : 'Sukulenti, kot je homulica, shranjujejo vodo v svojih listih in potrebujejo minimalno namakanje, kar jih naredi popolne za območja, nagnjena k suši.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Paper elevation={2} sx={{ mb: 6, overflow: 'hidden', borderRadius: 2 }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3, 
                  pb: 2, 
                  color: 'primary.dark', 
                  borderBottom: '1px solid',
                  borderColor: 'primary.light',
                  fontWeight: 600
                }}
              >
                {language === 'en' ? "Drought Theme" : "Tema suše"}
              </Typography>
              
              <Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 600 }}>
                  {language === 'en' ? "Problem Statement" : "Izjava o problemu"}
                </Typography>
                <Typography paragraph sx={{ mb: 3 }}>
                  {language === 'en' 
                    ? "Drought is a complex issue that affects not only the environment but also human societies and economies. It is essential to address this issue through a comprehensive approach that involves monitoring, education, and community engagement."
                    : "Suša je kompleksen problem, ki vpliva ne le na okolje, ampak tudi na človeške družbe in gospodarstvo. Pomembno je, da se temu problemu lotimo s celostnim pristopom, ki vključuje spremljanje, izobraževanje in vključevanje skupnosti."}
                </Typography>
                
                <Typography paragraph sx={{ mb: 3 }}>
                  {language === 'en' 
                    ? "The turf industry is a significant contributor to water consumption, and it is essential to develop sustainable practices that reduce water usage and promote drought resilience."
                    : "Industrija travnikov je pomemben deležnik porabe vode, zato je pomembno razviti trajnostne prakse, ki zmanjšajo porabo vode in spodbujajo odpornost proti suši."}
                </Typography>
                
                <Typography paragraph sx={{ mb: 3 }}>
                  {language === 'en' 
                    ? "Research and development of new technologies and strategies are crucial for addressing the issue of drought. It is essential to invest in research and development to find innovative solutions that promote sustainable water management practices."
                    : "Raziskave in razvoj novih tehnologij in strategij so ključni za reševanje problema suše. Pomembno je, da se vložimo v raziskave in razvoj, da se najdejo inovativna rešitva, ki spodbujajo trajnostne prakse upravljanja z vodo."}
                </Typography>
                
                <Typography paragraph sx={{ mb: 3 }}>
                  {language === 'en' 
                    ? "Cover plants are an essential component of sustainable water management practices. They help to reduce soil erosion, promote soil health, and increase biodiversity."
                    : "Pokrovne rastline so pomemben del trajnostnih praks upravljanja z vodo. Pomagajo zmanjšati erozijo tal, spodbujajo zdravje tal in povečajo biotsko raznovrstnost."}
                </Typography>
                
                <Typography paragraph>
                  {language === 'en' 
                    ? "Soil health is critical for sustainable water management practices. It is essential to promote soil health through the use of cover plants, organic amendments, and conservation tillage."
                    : "Zdravje tal je kritično za trajnostne prakse upravljanja z vodo. Pomembno je spodbujati zdravje tal z uporabo pokrovnih rastlin, organskih dodatkov in konzervativnega oranja."}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Sensors Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ mb: 6, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ 
              position: 'absolute', 
              zIndex: -1, 
              opacity: 0.05, 
              right: 0, 
              top: 0, 
              width: 256, 
              height: 256, 
              transform: 'rotate(45deg)' 
            }}>
              <Image 
                src="/images/illustrations/botanical-1.jpg" 
                alt="Decorative botanical illustration" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            
            <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
              {language === 'en' ? "Technology & Goals" : "Tehnologija in cilji"}
            </Typography>
            <Box sx={{ width: '100%', mb: 6 }} />
            
            <Grid container spacing={6}>
              <Grid item xs={12} lg={12}>
                <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                  Technology & Goals
                </Typography>
                <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 600 }}>
                        Technology
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        We use Arduino-based sensors and the Reticulum network to collect environmental data in real-time. Our system includes sensors deployed on Samsung Galaxy and MacBook devices, providing insights into soil conditions and environmental factors.
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 600 }}>
                        Goals
                      </Typography>
                      <List>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>•</ListItemIcon>
                          <ListItemText primary="Monitor soil moisture and environmental conditions in real-time" primaryTypographyProps={{ color: 'text.secondary' }} />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>•</ListItemIcon>
                          <ListItemText primary="Research and implement indigenous cover plants for drought prevention" primaryTypographyProps={{ color: 'text.secondary' }} />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>•</ListItemIcon>
                          <ListItemText primary="Develop sustainable irrigation practices based on collected data" primaryTypographyProps={{ color: 'text.secondary' }} />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>•</ListItemIcon>
                          <ListItemText primary="Educate communities about water conservation and climate change adaptation" primaryTypographyProps={{ color: 'text.secondary' }} />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>•</ListItemIcon>
                          <ListItemText primary="Create a model for urban adaptation to climate change with sustainable approaches" primaryTypographyProps={{ color: 'text.secondary' }} />
                        </ListItem>
                      </List>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 6 }}>
              <BiodiversityShowcase 
                items={biodiversityItems}
                title={{
                  en: 'Biodiversity at Livada Biotope',
                  sl: 'Biotska raznovrstnost v Biotopu Livada'
                }}
                description={{
                  en: 'Discover the rich biodiversity of the Livada Biotope through our monitoring project. These species are part of our ongoing conservation efforts.',
                  sl: 'Odkrijte bogato biotsko raznovrstnost Biotopa Livada prek našega projekta spremljanja. Te vrste so del naših stalnih prizadevanj za ohranjanje.'
                }}
              />
            </Box>
            
            <Box sx={{ 
              position: 'absolute', 
              zIndex: -1, 
              opacity: 0.05, 
              left: 0, 
              bottom: 0, 
              width: 256, 
              height: 256, 
              transform: 'rotate(-45deg)' 
            }}>
              <Image 
                src="/images/illustrations/botanical-2.jpg" 
                alt="Decorative botanical illustration" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Section: Join Us */}
        <Box sx={{ mb: 8, mt: 12 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.dark', fontWeight: 600 }}>
            Join Our Mission for Climate Resilience
          </Typography>
          
          <Typography paragraph sx={{ mb: 5, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            We welcome volunteers, donations, and community engagement to help us expand our work on climate resilience and biodiversity conservation. Your contribution makes a difference in creating sustainable urban environments.
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 2,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>Volunteer</Typography>
                  <Typography sx={{ mb: 3, color: 'text.secondary' }}>Join our team of volunteers to help with planting, monitoring, and maintaining the Biotope Livada site.</Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    href="/contact"
                    sx={{ 
                      borderRadius: 8,
                      px: 3
                    }}
                  >
                    Get Involved
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 2,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>Donate</Typography>
                  <Typography sx={{ mb: 3, color: 'text.secondary' }}>Support our work through donations that help us purchase equipment, plants, and educational materials.</Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    href="/contact"
                    sx={{ 
                      borderRadius: 8,
                      px: 3
                    }}
                  >
                    Support Us
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 2,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>Spread the Word</Typography>
                  <Typography sx={{ mb: 3, color: 'text.secondary' }}>Share our project with your community, on social media, and help us raise awareness about climate resilience.</Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    href="/contact"
                    sx={{ 
                      borderRadius: 8,
                      px: 3
                    }}
                  >
                    Share Project
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'primary.dark', fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Typography paragraph>
              Email: info@livada-biotope.si
            </Typography>
            <Typography paragraph>
              Location: Ljubljana, Slovenia
            </Typography>
          </Box>
        </Box>
      </Container>
  );
}

// Add getLayout function to the page
LetsNotDryOutTheFuture.getLayout = (page: React.ReactNode) => (
  <SharedLayout title="Ne izsušimo prihodnosti">{page}</SharedLayout>
);