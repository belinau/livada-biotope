import React, { useState } from 'react';
import SharedLayout from '@/components/layout/SharedLayout';
import { SensorVisualization } from '@/components/features/SensorVisualization';
import VintageGallery from '@/components/features/VintageGallery';
import BiodiversityShowcase from '@/components/features/BiodiversityShowcase';
import StylizedImage from '@/components/StylizedImage';
import { getBotanicalIllustrations, getZoologicalIllustrations } from '@/lib/illustrationsData';
import { biodiversityItems } from '@/lib/biodiversityData';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
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
  const [activeTab, setActiveTab] = useState(0);
  const botanicalIllustrations = getBotanicalIllustrations();
  const zoologicalIllustrations = getZoologicalIllustrations();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Tab panel component to handle content switching
  const TabPanel = (props: { children?: React.ReactNode; index: number; value: number }) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`project-tabpanel-${index}`}
        aria-labelledby={`project-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ 
            color: 'primary.main', 
            mb: 2,
            fontWeight: 700 
          }}>
            {t('projects.letsNotDryOut')}
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary' }}>
            {t('projects.letsNotDryOut.description')}
          </Typography>
        </Box>
        
        {/* Secondary menu with three items */}
        <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
            aria-label="project navigation tabs"
          >
            <Tab label={t('project.tabs.sensors')} />
            <Tab label={t('project.tabs.climateChange')} />
            <Tab label={t('project.tabs.joinUs')} />
          </Tabs>
        </Paper>

        {/* Tab content */}
        <TabPanel value={activeTab} index={1}>
          {/* Climate Change Tab Content */}
          <Typography paragraph sx={{ mb: 3 }}>{t('project.drought.intro')}</Typography>
          <Typography paragraph sx={{ mb: 4 }}>{t('project.drought.economic')}</Typography>

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
            <Typography paragraph sx={{ mb: 2 }}>{t('project.drought.slovenia')}</Typography>
            <Typography paragraph sx={{ mb: 2 }}>{t('project.drought.geographical')}</Typography>
            <Typography paragraph>{t('project.drought.response')}</Typography>
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
            <Typography paragraph sx={{ mb: 2 }}>{t('project.drought.ljubljana')}</Typography>
            <Typography paragraph sx={{ mb: 2 }}>{t('project.drought.efforts')}</Typography>
            <Typography paragraph>{t('project.drought.challenge')}</Typography>
          </Paper>

          <Typography variant="h5" sx={{ mt: 5, mb: 3, color: 'primary.dark', fontWeight: 600 }}>
            {t('project.drought.consequences.title')}
          </Typography>
          
          <List sx={{ mb: 4 }}>
            <ListItem 
              component={Paper} 
              elevation={1} 
              sx={{ mb: 2, p: 2, borderRadius: 1 }}
            >
              <Typography>{t('project.drought.consequences.cracks')}</Typography>
            </ListItem>
            <ListItem 
              component={Paper} 
              elevation={1} 
              sx={{ mb: 2, p: 2, borderRadius: 1 }}
            >
              <Typography>{t('project.drought.consequences.drying')}</Typography>
            </ListItem>
            <ListItem 
              component={Paper} 
              elevation={1} 
              sx={{ p: 2, borderRadius: 1 }}
            >
              <Typography>{t('project.drought.consequences.dusting')}</Typography>
            </ListItem>
          </List>

          <Box sx={{ my: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'primary.dark', fontWeight: 600 }}>
              {t('project.drought.plants.title', language === 'en' ? 'Selected Plant Species' : 'Izbrane rastlinske vrste')}
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
                {t('project.drought.theme.title')}
              </Typography>
              
              <Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.dark', fontWeight: 600 }}>
                  {t('project.drought.theme.problem')}
                </Typography>
                <Typography paragraph sx={{ mb: 3 }}>{t('project.drought.theme.description')}</Typography>
                
                <Typography paragraph sx={{ mb: 3 }}>{t('project.drought.theme.turf')}</Typography>
                
                <Typography paragraph sx={{ mb: 3 }}>{t('project.drought.theme.research')}</Typography>
                
                <Typography paragraph sx={{ mb: 3 }}>{t('project.drought.theme.coverplants')}</Typography>
                
                <Typography paragraph>{t('project.drought.theme.soil')}</Typography>
              </Box>
            </Box>
          </Paper>
        </TabPanel>

        {/* Sensors Tab */}
        <TabPanel value={activeTab} index={0}>
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
              <img 
                src="/images/illustrations/botanical-1.jpg" 
                alt="Decorative botanical illustration" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            
            <Typography variant="h4" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
              Sensor Data
            </Typography>
            <Box sx={{ width: '100%', mb: 6 }}>
              <SensorVisualization />
            </Box>
            
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
              <img 
                src="/images/illustrations/botanical-2.jpg" 
                alt="Decorative botanical illustration" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
          </Box>
        </TabPanel>

        {/* Join Us Tab */}
        <TabPanel value={activeTab} index={2}>
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
        </TabPanel>
      </Container>
  );
}

// Add getLayout function to the page
LetsNotDryOutTheFuture.getLayout = (page: React.ReactNode) => (
  <SharedLayout title="Ne izsušimo prihodnosti">{page}</SharedLayout>
);