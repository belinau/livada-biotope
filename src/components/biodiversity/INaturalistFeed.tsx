'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Skeleton, 
  useTheme, 
  useMediaQuery, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Link,
  IconButton,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { 
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

// Import types
import { INaturalistObservation } from '@/types/inaturalist';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  '& .MuiCardMedia-root': {
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover .MuiCardMedia-root': {
    transform: 'scale(1.05)',
  },
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  paddingTop: '75%', // 4:3 aspect ratio
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.08)',
});

const StyledCardMedia = styled(CardMedia)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ObservationDate = ({ dateString }: { dateString: string }) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
      <CalendarIcon fontSize="small" />
      <Typography variant="body2" component="span">
        {formattedDate}
      </Typography>
    </Box>
  );
};

const QualityGradeBadge = ({ grade }: { grade: string }) => {
  if (!grade) return null;
  
  const getGradeLabel = (g: string) => {
    switch (g) {
      case 'research': return 'Research Grade';
      case 'needs_id': return 'Needs ID';
      case 'casual': return 'Casual';
      default: return g;
    }
  };

  return (
    <Chip 
      size="small" 
      label={getGradeLabel(grade)} 
      color={grade === 'research' ? 'success' : 'default'}
      variant="outlined"
    />
  );
};

interface INaturalistFeedProps {
  maxItems?: number;
  showTitle?: boolean;
  showViewAll?: boolean;
  locale?: string;
}

const INaturalistFeed: React.FC<INaturalistFeedProps> = ({ 
  maxItems = 6, 
  showTitle = true,
  showViewAll = true,
  locale = 'en'
}) => {
  const [observations, setObservations] = useState<INaturalistObservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('biodiversity');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/inaturalist?per_page=${maxItems}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch observations');
        }
        
        const data = await response.json();
        setObservations(data.results || []);
      } catch (err) {
        console.error('Error fetching iNaturalist observations:', err);
        setError(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [maxItems, t]);

  const renderLoadingSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </Grid>
    ));
  };

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getSpeciesName = (observation: INaturalistObservation) => {
    return observation.taxon?.preferred_common_name || 
           observation.taxon?.name || 
           t('unknownSpecies');
  };

  return (
    <Box>
      {showTitle && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h2" gutterBottom={false}>
            {t('recentObservations')}
          </Typography>
          {showViewAll && (
            <Link href="/biodiversity/observations" color="primary">
              {t('viewAll')}
            </Link>
          )}
        </Box>
      )}
      
      <Grid container spacing={3}>
        {loading ? (
          renderLoadingSkeletons()
        ) : (
          observations.map((observation) => {
            const speciesName = getSpeciesName(observation);
            const photoUrl = observation.photos?.[0]?.url?.replace('square', 'medium');
            const identificationsCount = observation.identifications_count || 0;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={observation.id}>
                <StyledCard>
                  <ImageContainer>
                    {photoUrl ? (
                      <StyledCardMedia
                        image={photoUrl}
                        title={speciesName}
                      />
                    ) : (
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        height="100%"
                        bgcolor="background.paper"
                      >
                        <Typography color="text.secondary">
                          {t('noImage')}
                        </Typography>
                      </Box>
                    )}
                  </ImageContainer>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h3" noWrap>
                        {speciesName}
                      </Typography>
                      <Tooltip title={t('viewOnINaturalist')}>
                        <IconButton 
                          size="small" 
                          href={`https://www.inaturalist.org/observations/${observation.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {observation.taxon?.name && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <i>{observation.taxon.name}</i>
                      </Typography>
                    )}
                    
                    <Stack direction="row" spacing={1} mb={1}>
                      {observation.quality_grade && (
                        <QualityGradeBadge grade={observation.quality_grade} />
                      )}
                      {observation.user?.login && (
                        <Chip
                          size="small"
                          icon={<PersonIcon />}
                          label={observation.user.login}
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    
                    <Box display="flex" flexDirection="column" gap={1} mt={2}>
                      {observation.observed_on_string && (
                        <ObservationDate dateString={observation.observed_on_string} />
                      )}
                      
                      {observation.place_guess && (
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <LocationIcon fontSize="small" />
                          <Typography variant="body2" noWrap>
                            {observation.place_guess}
                          </Typography>
                        </Box>
                      )}
                      
                      {identificationsCount > 0 && (
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <VisibilityIcon fontSize="small" />
                          <Typography variant="body2">
                            {t('identifications', { count: identificationsCount })}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default INaturalistFeed;
