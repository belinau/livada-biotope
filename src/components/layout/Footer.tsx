import { Box, Container, Grid, Typography, Link as MuiLink, Divider, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <FacebookIcon />, 
      url: 'https://facebook.com/livadabiotope' 
    },
    { 
      name: 'Instagram', 
      icon: <InstagramIcon />, 
      url: 'https://instagram.com/livadabiotope' 
    },
    { 
      name: 'Email', 
      icon: <EmailIcon />, 
      url: 'mailto:info@livada.bio' 
    }
  ];

  const quickLinks = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'projects', path: '/projects' },
    { name: 'biodiversity', path: '/biodiversity' },
    { name: 'events', path: '/events' },
    { name: 'contact', path: '/contact' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Livada Biotope
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('description')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  aria-label={social.name}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>


          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('quickLinks')}
            </Typography>
            <Box component="nav">
              {quickLinks.map((item) => (
                <Link key={item.name} href={item.path} passHref legacyBehavior>
                  <MuiLink
                    component="a"
                    color="text.secondary"
                    variant="body2"
                    display="block"
                    gutterBottom
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {t(`navigation.${item.name}`)}
                  </MuiLink>
                </Link>
              ))}
            </Box>
          </Grid>


          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('contactUs')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Livada 23, 1291 Škocjan, Slovenia
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon color="action" sx={{ mr: 1 }} />
              <MuiLink href="mailto:info@livada.bio" color="text.secondary" variant="body2">
                info@livada.bio
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {t('copyright')} {currentYear} Livada Biotope. {t('rightsReserved')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
