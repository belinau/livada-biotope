import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

interface BiodiversityItem {
  id: string;
  name: {
    en: string;
    sl: string;
    scientific: string;
  };
  description: {
    en: string;
    sl: string;
  };
  type: 'plant' | 'animal' | 'fungi' | 'other';
  imageUrl: string;
  inaturalistUrl?: string;
}

interface BiodiversityShowcaseProps {
  title?: {
    en: string;
    sl: string;
  };
  description?: {
    en: string;
    sl: string;
  };
  items: BiodiversityItem[];
  className?: string;
}

const BiodiversityShowcase: React.FC<BiodiversityShowcaseProps> = ({
  title = {
    en: 'Biodiversity Monitoring',
    sl: 'Spremljanje biotske raznovrstnosti'
  },
  description = {
    en: 'Discover the rich biodiversity of the Livada Biotope through our monitoring project.',
    sl: 'Odkrijte bogato biotsko raznovrstnost Biotopa Livada prek našega projekta spremljanja.'
  },
  items,
  className = '',
}) => {
  const { language } = useLanguage();

  // Helper function to get type icon text
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'plant': return '🌿';
      case 'animal': return '🦋';
      case 'fungi': return '🍄';
      case 'other': return '✨';
      default: return '';
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
        {title[language]}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
        {description[language]}
      </Typography>
      
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image={item.imageUrl}
                  alt={item.name[language]}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    p: 1
                  }}
                >
                  <Chip 
                    label={`${getTypeIcon(item.type)} ${item.type}`} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(0,0,0,0.3)', 
                      color: 'white',
                      fontSize: '0.75rem'
                    }} 
                  />
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" component="h3" sx={{ color: 'primary.dark', mb: 0.5, fontWeight: 'medium' }}>
                  {item.name[language]}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', mb: 1.5 }}>
                  {item.name.scientific}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description[language]}
                </Typography>
                
                {item.inaturalistUrl && (
                  <Button 
                    href={item.inaturalistUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    size="small"
                    variant="text"
                    color="primary"
                    sx={{ fontSize: '0.75rem', p: 0, textTransform: 'none' }}
                  >
                    {language === 'en' ? 'View on iNaturalist' : 'Ogled na iNaturalist'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          href="https://www.inaturalist.org/projects/the-livada-biotope-monitoring" 
          target="_blank" 
          rel="noopener noreferrer" 
          variant="contained"
          color="primary"
        >
          {language === 'en' ? 'Explore All Observations' : 'Raziščite vse opazke'}
        </Button>
      </Box>
    </Box>
  );
};

export default BiodiversityShowcase;
