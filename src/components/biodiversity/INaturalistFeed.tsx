import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import useTranslations from '../../hooks/useTranslations';
import { fetchWithCache } from '../../lib/cacheUtils';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Define interfaces for the iNaturalist API response
interface Taxon {
  id: number;
  name: string;
  preferred_common_name?: string;
}

interface INaturalistPhoto {
  id?: number;
  url?: string;
  medium_url?: string;
  large_url?: string;
  original_url?: string;
}

interface INaturalistObservation {
  id: string;
  species_guess: string;
  uri: string;
  user: {
    login: string;
    name: string;
  };
  taxon?: Taxon;
  photos?: INaturalistPhoto[];
  created_at: string;
  place_guess?: string;
  // Processed fields
  formattedName?: string;
  imageUrl?: string;
  date?: string;
  // Fallback image URLs
  originalUrl?: string;
  largeUrl?: string;
  mediumUrl?: string;
  baseUrl?: string;
}

interface INaturalistApiResponse {
  results: INaturalistObservation[];
}

const INaturalistFeed: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [observations, setObservations] = useState<INaturalistObservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const ITEMS_PER_PAGE = 6; // Number of observations to load per page
  
  // Function to fetch observations - can be called multiple times for pagination
  const fetchObservations = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      
      // Set locale based on language
      const locale = language === 'sl' ? 'sl' : 'en';
      
      // Use Netlify serverless function instead of direct API call
      // This will handle caching, rate limiting, and optimize the response
      const functionUrl = `/.netlify/functions/inaturalist?page=${pageNum}&per_page=${ITEMS_PER_PAGE}&locale=${locale}&project_id=the-livada-biotope-monitoring`;
      
      // Simple fetch without cache since the function handles caching
      const response = await fetch(functionUrl);
      
      if (!response.ok) {
        throw new Error(`Error fetching from serverless function: ${response.status}`);
      }
      
      const data: INaturalistApiResponse = await response.json();
        
        // Process observations to ensure high-res images and proper localization
        const processedObservations = data.results.map(observation => {
          let imageUrl = 'https://via.placeholder.com/800x600?text=No+Image';
          
          // Optimized approach to get high-resolution images while improving performance
          if (observation.photos && observation.photos.length > 0) {
            const photo = observation.photos[0];
            
            // Function to check if URL is a thumbnail from any iNaturalist domain
            const isINaturalistThumbnail = (url: string | undefined) => {
              if (!url) return false;
              
              // Match any iNaturalist domain with square thumbnails
              return (url.includes('square.jpg') || url.includes('square.jpeg')) && 
                     (url.includes('inaturalist.org') || url.includes('s3.amazonaws.com'));
            };
            
            // Special case for square thumbnails from any iNaturalist domain
            if (photo.url && isINaturalistThumbnail(photo.url)) {
              // Handle both .jpg and .jpeg extensions
              const isJpeg = photo.url.includes('.jpeg');
              const squarePattern = isJpeg ? 'square.jpeg' : 'square.jpg';
              const largePattern = isJpeg ? 'large.jpeg' : 'large.jpg';
              const originalPattern = isJpeg ? 'original.jpeg' : 'original.jpg';
              const mediumPattern = isJpeg ? 'medium.jpeg' : 'medium.jpg';
              
              // Directly replace square with large for better performance balance
              imageUrl = photo.url.replace(squarePattern, largePattern);
              console.log(`iNaturalist thumbnail detected, using large version: ${imageUrl}`);
              
              // Store fallback URLs without doing excessive replacements
              observation.originalUrl = photo.url.replace(squarePattern, originalPattern);
              observation.largeUrl = imageUrl;
              observation.mediumUrl = photo.url.replace(squarePattern, mediumPattern);
              observation.baseUrl = photo.url;
            }
            // Use photo ID if available (fastest approach)
            else if (photo.id) {
              // Use large format by default - better performance while still high quality
              imageUrl = `https://static.inaturalist.org/photos/${photo.id}/large.jpg`;
              console.log(`Using photo ID ${photo.id} for URL: ${imageUrl}`);
              
              // Store other resolutions for fallbacks
              observation.originalUrl = `https://static.inaturalist.org/photos/${photo.id}/original.jpg`;
              observation.largeUrl = imageUrl;
              observation.mediumUrl = `https://static.inaturalist.org/photos/${photo.id}/medium.jpg`;
              observation.baseUrl = photo.url || observation.mediumUrl;
            }
            // Use API-provided URLs if available
            else {
              // Start with large URL (best balance between quality and performance)
              if (photo.large_url) {
                imageUrl = photo.large_url;
                console.log(`Using large_url: ${imageUrl}`);
              }
              // Fall back to other formats if large not available
              else if (photo.original_url) {
                imageUrl = photo.original_url;
                console.log(`Using original_url: ${imageUrl}`);
              }
              else if (photo.medium_url) {
                imageUrl = photo.medium_url;
                console.log(`Using medium_url: ${imageUrl}`);
              }
              else if (photo.url) {
                // Handle any remaining URL patterns
                imageUrl = photo.url;
                console.log(`Using base URL: ${imageUrl}`);
                
                // Check for square thumbnails from any iNaturalist domain
                if ((imageUrl.includes('square.jpg') || imageUrl.includes('square.jpeg')) &&
                    (imageUrl.includes('inaturalist.org') || imageUrl.includes('s3.amazonaws.com'))) {
                  const isJpeg = imageUrl.includes('.jpeg');
                  const squarePattern = isJpeg ? 'square.jpeg' : 'square.jpg';
                  const largePattern = isJpeg ? 'large.jpeg' : 'large.jpg';
                  
                  imageUrl = imageUrl.replace(squarePattern, largePattern);
                  console.log(`Replaced square thumbnail with large: ${imageUrl}`);
                }
              }
              
              // Store URLs for fallbacks
              observation.originalUrl = photo.original_url;
              observation.largeUrl = photo.large_url;
              observation.mediumUrl = photo.medium_url;
              observation.baseUrl = photo.url;
            }
          }
          
          // Format date according to locale
          const date = new Date(observation.created_at);
          const formattedDate = date.toLocaleDateString(
            locale === 'sl' ? 'sl-SI' : 'en-US'
          );
          
          // Get localized name
          let formattedName = observation.species_guess;
          if (locale === 'sl' && observation.taxon?.preferred_common_name) {
            formattedName = observation.taxon.preferred_common_name;
          } else if (observation.taxon?.preferred_common_name) {
            formattedName = observation.taxon.preferred_common_name;
          }
          
          return {
            ...observation,
            formattedName,
            imageUrl,
            date: formattedDate
          };
        });
        
        if (append) {
          // Append new observations to existing ones
          setObservations(prev => [...prev, ...processedObservations]);
          setLoadingMore(false);
        } else {
          // Replace observations (first page load)
          setObservations(processedObservations);
          setLoading(false);
        }
        
        // Check if there are more observations to load
        setHasMore(processedObservations.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching observations:', error);
        setError(language === 'sl' ? 'Napaka pri nalaganju podatkov.' : 'Error loading data.');
        append ? setLoadingMore(false) : setLoading(false);
      }
    }, [language]);
  
  // Initial load of observations
  useEffect(() => {
    // Reset pagination when language changes
    setPage(1);
    setHasMore(true);
    fetchObservations(1, false);
    
    return () => {
      // Cleanup if needed
    };
  }, [language, fetchObservations]);
  
  // Function to load more observations
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchObservations(nextPage, true);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress color="success" />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {language === 'en' 
            ? 'You can view all observations directly on iNaturalist:' 
            : 'Vsa opažanja si lahko ogledate neposredno na iNaturalist:'}
        </Typography>
        <Button 
          href="https://www.inaturalist.org/projects/the-livada-biotope-monitoring"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          iNaturalist
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        {language === 'en' ? 'Recent Observations' : 'Nedavna opažanja'}
      </Typography>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {observations.map((observation) => (
          <div key={observation.id}>
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
                  image={observation.imageUrl}
                  alt={observation.formattedName || observation.species_guess}
                  onError={(e) => {
                    // Simplified error handling for better performance
                    const target = e.target as HTMLImageElement;
                    const currentSrc = target.src;
                    console.log(`Image failed to load: ${currentSrc}`);
                    
                    // Track attempts to prevent infinite loops
                    if (!target.dataset.fallbackAttempts) {
                      target.dataset.fallbackAttempts = '1';
                    } else {
                      const attempts = parseInt(target.dataset.fallbackAttempts, 10);
                      target.dataset.fallbackAttempts = (attempts + 1).toString();
                      
                      if (attempts >= 2) {
                        // Use placeholder after two failed attempts
                        target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                        target.onerror = null;
                        return;
                      }
                    }
                    
                    // Fast path for common cases
                    if (currentSrc.includes('original.jpg') && observation.largeUrl) {
                      // If original failed, try large
                      target.src = observation.largeUrl;
                      return;
                    }
                    
                    if (currentSrc.includes('large.jpg') && observation.mediumUrl) {
                      // If large failed, try medium
                      target.src = observation.mediumUrl;
                      return;
                    }
                    
                    // Handle square thumbnails from any iNaturalist domain
                    if ((currentSrc.includes('square.jpg') || currentSrc.includes('square.jpeg')) &&
                        (currentSrc.includes('inaturalist.org') || currentSrc.includes('s3.amazonaws.com'))) {
                      const isJpeg = currentSrc.includes('.jpeg');
                      const squarePattern = isJpeg ? 'square.jpeg' : 'square.jpg';
                      const largePattern = isJpeg ? 'large.jpeg' : 'large.jpg';
                      
                      console.log(`Found iNaturalist thumbnail, upgrading to large: ${currentSrc}`);
                      // Replace square with large directly
                      target.src = currentSrc.replace(squarePattern, largePattern);
                      return;
                    }
                    
                    // Simplified fallback chain
                    if (observation.mediumUrl && !currentSrc.includes('medium')) {
                      // Try medium if we haven't already
                      target.src = observation.mediumUrl;
                    } else if (observation.baseUrl && !currentSrc.includes(observation.baseUrl)) {
                      // Try base URL if we haven't already
                      target.src = observation.baseUrl;
                    } else {
                      // Final fallback
                      target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                      target.onerror = null;
                    }
                  }}
                  sx={{ 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {/* Display localized name if available */}
                  {observation.formattedName || observation.species_guess}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                  {observation.taxon?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom sx={{ mt: 1, mb: 1 }}>
                  <strong>{observation.date}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'en' ? 'By' : 'Avtor'}: {observation.user.name || observation.user.login}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {observation.place_guess}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    href={observation.uri} 
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="primary"
                  >
                    {language === 'en' ? 'View on iNaturalist' : 'Ogled na iNaturalist'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Load More button */}
      {!loading && observations.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          {loadingMore ? (
            <CircularProgress size={30} color="primary" />
          ) : hasMore ? (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={loadMore}
              startIcon={<span>+</span>}
              sx={{ 
                py: 1.5,
                px: 3,
                borderRadius: 8,
                boxShadow: 2,
                '&:hover': { boxShadow: 4 }
              }}
            >
              {language === 'en' ? 'Load More Observations' : 'Naloži več opažanj'}
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {language === 'en' ? 'No more observations to load' : 'Ni več opažanj za nalaganje'}
            </Typography>
          )}
        </Box>
      )}
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          href="https://www.inaturalist.org/projects/the-livada-biotope-monitoring"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="primary"
        >
          {language === 'en' ? 'View all observations on iNaturalist' : 'Oglejte si vsa opažanja na iNaturalist'}
        </Button>
      </Box>
    </Box>
  );
};

export default INaturalistFeed;
