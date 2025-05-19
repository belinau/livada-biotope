'use client';

import { Box, Card, CardContent, CardMedia, Grid, Typography, Chip, useTheme, useMediaQuery } from '@mui/material';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';

export interface BiodiversityItem {
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
  observedAt?: string;
  observedBy?: string;
}

interface BiodiversityShowcaseProps {
  items: BiodiversityItem[];
  maxItems?: number;
  showHeader?: boolean;
}

export default function BiodiversityShowcase({ 
  items, 
  maxItems = 6,
  showHeader = true 
}: BiodiversityShowcaseProps) {
  const locale = useLocale() as 'en' | 'sl';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const displayedItems = useMemo(() => {
    return items.slice(0, maxItems);
  }, [items, maxItems]);

  const getTypeColor = (type: string) => {
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

  const getLocalizedType = (type: string) => {
    const types: Record<string, { en: string; sl: string }> = {
      plant: { en: 'Plant', sl: 'Rastlina' },
      animal: { en: 'Animal', sl: 'Žival' },
      fungi: { en: 'Fungi', sl: 'Gliva' },
      other: { en: 'Other', sl: 'Drugo' },
    };
    return types[type]?.[locale] || type;
  };

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          {locale === 'sl' ? 'Ni najdenih vrst' : 'No species found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {showHeader && (
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          {locale === 'sl' ? 'Najdene vrste' : 'Featured Species'}
        </Typography>
      )}
      
      <Grid container spacing={3}>
        {displayedItems.map((item) => (
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
                  transform: !isMobile ? 'translateY(-4px)' : 'none',
                  boxShadow: theme.shadows[4],
                },
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ position: 'relative', pt: '56.25%' }}>
                <CardMedia
                  component="img"
                  image={item.imageUrl}
                  alt={item.name[locale] || item.name.en}
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
                  label={getLocalizedType(item.type)}
                  color={getTypeColor(item.type) as any}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                  }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {item.name[locale] || item.name.en}
                  </Typography>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    sx={{ fontStyle: 'italic', mb: 1 }}
                  >
                    {item.name.scientific}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                  {item.description[locale] || item.description.en}
                </Typography>
                
                {(item.observedAt || item.observedBy) && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 'auto' }}>
                    {item.observedAt && (
                      <>{locale === 'sl' ? 'Opazovano' : 'Observed'}: {new Date(item.observedAt).toLocaleDateString(locale, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</>
                    )}
                    {item.observedBy && (
                      <>{item.observedAt ? ' • ' : ''}{locale === 'sl' ? 'Opazovalec' : 'Observer'}: {item.observedBy}</>
                    )}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
