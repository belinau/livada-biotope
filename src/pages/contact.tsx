import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from '../contexts/LanguageContext';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import StylizedImage from '../components/StylizedImage';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
    {children}
  </Link>
);

export default function ContactPage() {
  const { language } = useLanguage();
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submission logic would go here
    alert(language === 'en' ? 'Form submitted! (Demo only)' : 'Obrazec poslan! (Samo demo)');
  };
  
  return (
    <>
      <Head>
        <title>{language === 'en' ? 'Contact Us | Livada Biotope' : 'Kontakt | Livada Biotope'}</title>
        <meta 
          name="description" 
          content={language === 'en' 
            ? "Get in touch with the Livada Biotope team to learn more about our ecological initiatives or how you can get involved." 
            : "Stopite v stik z ekipo Biotopa Livada in izvedite več o naših ekoloških pobudah ali o tem, kako se lahko vključite."}
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
                {language === 'en' ? 'Contact' : 'Kontakt'}
              </Typography>
            </Typography>
          </Box>
          
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
            {language === 'en' ? 'Contact Us' : 'Kontaktirajte nas'}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom color="primary.main">
                  {language === 'en' ? 'Get in Touch' : 'Stopite v stik'}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {language === 'en' ? 'Email:' : 'E-pošta:'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <a href="mailto:info@livadabiotope.si" style={{ color: '#4caf50' }}>
                      info@livadabiotope.si
                    </a>
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {language === 'en' ? 'Phone:' : 'Telefon:'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    +386 1 234 5678
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {language === 'en' ? 'Address:' : 'Naslov:'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Livada Biotope<br />
                    Livada 1<br />
                    1000 Ljubljana<br />
                    Slovenia
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {language === 'en' ? 'Social Media:' : 'Družbena omrežja:'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Button href="https://twitter.com/livadabiotope" variant="text" color="primary">
                      Twitter
                    </Button>
                    <Button href="https://instagram.com/livadabiotope" variant="text" color="primary">
                      Instagram
                    </Button>
                    <Button href="https://facebook.com/livadabiotope" variant="text" color="primary">
                      Facebook
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom color="primary.main">
                  {language === 'en' ? 'Send us a Message' : 'Pošljite nam sporočilo'}
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label={language === 'en' ? 'Name' : 'Ime'}
                    variant="outlined"
                    required
                    margin="normal"
                  />
                  
                  <TextField
                    fullWidth
                    label={language === 'en' ? 'Email' : 'E-pošta'}
                    variant="outlined"
                    type="email"
                    required
                    margin="normal"
                  />
                  
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="subject-label">
                      {language === 'en' ? 'Subject' : 'Zadeva'}
                    </InputLabel>
                    <Select
                      labelId="subject-label"
                      label={language === 'en' ? 'Subject' : 'Zadeva'}
                      defaultValue=""
                      required
                    >
                      <MenuItem value="">
                        <em>{language === 'en' ? 'Select a subject' : 'Izberite zadevo'}</em>
                      </MenuItem>
                      <MenuItem value="general">
                        {language === 'en' ? 'General Inquiry' : 'Splošno povpraševanje'}
                      </MenuItem>
                      <MenuItem value="volunteer">
                        {language === 'en' ? 'Volunteering' : 'Prostovoljstvo'}
                      </MenuItem>
                      <MenuItem value="project">
                        {language === 'en' ? 'Project Collaboration' : 'Projektno sodelovanje'}
                      </MenuItem>
                      <MenuItem value="donation">
                        {language === 'en' ? 'Donations & Sponsorship' : 'Donacije in sponzorstvo'}
                      </MenuItem>
                      <MenuItem value="other">
                        {language === 'en' ? 'Other' : 'Drugo'}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label={language === 'en' ? 'Message' : 'Sporočilo'}
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                    margin="normal"
                  />
                  
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{ mt: 2, fontWeight: 'medium' }}
                  >
                    {language === 'en' ? 'Send Message' : 'Pošlji sporočilo'}
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>
          
          <Paper elevation={2} sx={{ mt: 6, p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom color="primary.main">
              {language === 'en' ? 'Visit Us' : 'Obiščite nas'}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {language === 'en'
                ? 'Livada Biotope is located in the southern part of Ljubljana, easily accessible by bicycle or public transport. We welcome visitors during our open hours or by appointment.'
                : 'Biotop Livada se nahaja v južnem delu Ljubljane in je lahko dostopen s kolesom ali javnim prevozom. Obiskovalce sprejemamo med našimi odprtimi urami ali po dogovoru.'}
            </Typography>
            
            <Box sx={{ height: '400px', bgcolor: '#e0e0e0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {language === 'en' ? 'Map will be displayed here' : 'Tukaj bo prikazan zemljevid'}
              </Typography>
            </Box>
          </Paper>
          
          <Divider sx={{ my: 6 }} />
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              © Livada Biotope {new Date().getFullYear()}
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
