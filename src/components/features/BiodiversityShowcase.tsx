'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Chip, 
  Link
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BiodiversityItem, 
  BiodiversityItemType 
} from '@/types/biodiversity';

interface BiodiversityShowcaseProps {
  items: BiodiversityItem[];
}

const BiodiversityShowcase: React.FC<BiodiversityShowcaseProps> = ({ items }) => {
  const { locale } = useLanguage();
  const t = useTranslations('common');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTypeColor = (type: BiodiversityItemType) => {
    switch (type) {
      case 'plant':
        return 'success';
      case 'animal':
        return 'primary';
      case 'fungi':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          {t('noBiodiversityItems')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card 
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <Box sx={{ position: 'relative', pt: '56.25%' }}>
              <CardMedia
                component="img"
                image={item.imageUrl}
                alt={locale === 'en' ? item.name.en : item.name.sl}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Chip
                label={item.type}
                color={getTypeColor(item.type)}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="h6" component="h3" fontWeight={600}>
                  {locale === 'en' ? item.name.en : item.name.sl}
                </Typography>
                {item.inaturalistUrl && (
                  <Link 
                    href={item.inaturalistUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    color="primary"
                    variant="caption"
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      ml: 1
                    }}
                  >
                    iNaturalist
                  </Link>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" fontStyle="italic" mb={1.5}>
                {item.name.scientific}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === 'en' ? item.description.en : item.description.sl}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BiodiversityShowcase;
