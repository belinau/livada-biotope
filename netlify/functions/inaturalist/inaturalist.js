// Netlify serverless function to fetch and cache iNaturalist observations
const fetch = require('node-fetch');
const NodeCache = require('node-cache');

// Create a cache with a default TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

// Function to generate mock observation data when the API fails
function generateMockObservations(count, locale) {
  const mockSpecies = [
    {
      id: '1',
      species_guess: locale === 'sl' ? 'Navadna leska' : 'Common Hazel',
      uri: 'https://www.inaturalist.org/observations/1',
      user: { login: 'livada_admin', name: 'Livada Admin' },
      taxon: {
        id: 101,
        name: 'Corylus avellana',
        preferred_common_name: locale === 'sl' ? 'Navadna leska' : 'Common Hazel'
      },
      photos: [{
        medium_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/1234/medium.jpg',
        large_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/1234/large.jpg'
      }],
      created_at: '2023-05-15T12:30:45Z',
      place_guess: 'Ljubljana, Slovenia'
    },
    {
      id: '2',
      species_guess: locale === 'sl' ? 'Navadni pljučnik' : 'Common Lungwort',
      uri: 'https://www.inaturalist.org/observations/2',
      user: { login: 'livada_admin', name: 'Livada Admin' },
      taxon: {
        id: 102,
        name: 'Pulmonaria officinalis',
        preferred_common_name: locale === 'sl' ? 'Navadni pljučnik' : 'Common Lungwort'
      },
      photos: [{
        medium_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/2345/medium.jpg',
        large_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/2345/large.jpg'
      }],
      created_at: '2023-05-16T14:22:33Z',
      place_guess: 'Ljubljana, Slovenia'
    },
    {
      id: '3',
      species_guess: locale === 'sl' ? 'Travniška kadulja' : 'Meadow Sage',
      uri: 'https://www.inaturalist.org/observations/3',
      user: { login: 'livada_admin', name: 'Livada Admin' },
      taxon: {
        id: 103,
        name: 'Salvia pratensis',
        preferred_common_name: locale === 'sl' ? 'Travniška kadulja' : 'Meadow Sage'
      },
      photos: [{
        medium_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/3456/medium.jpg',
        large_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/3456/large.jpg'
      }],
      created_at: '2023-05-17T09:15:22Z',
      place_guess: 'Ljubljana, Slovenia'
    }
  ];
  
  return mockSpecies.slice(0, count);
}

// Maximum number of items per page to prevent abuse
const MAX_ITEMS_PER_PAGE = 20;

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Parse and validate query parameters
    const params = event.queryStringParameters || {};
    const page = Math.max(1, parseInt(params.page) || 1);
    const perPage = Math.min(MAX_ITEMS_PER_PAGE, Math.max(1, parseInt(params.per_page) || 6));
    const locale = ['en', 'sl'].includes(params.locale) ? params.locale : 'en';
    const projectId = params.project_id || 'the-livada-biotope-monitoring';

    // Create a cache key based on the request parameters
    const cacheKey = `inaturalist_${projectId}_${page}_${perPage}_${locale}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData),
      };
    }

    // Try to fetch from iNaturalist API with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(
        `https://api.inaturalist.org/v1/observations?` + new URLSearchParams({
          project_id: projectId,
          verifiable: 'any',
          order: 'desc',
          order_by: 'created_at',
          per_page: perPage,
          page: page,
          locale: locale,
          photos: 'true'
        }).toString(),
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'LivadaBiotope/1.0 (https://livada-biotope.netlify.app/)',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `iNaturalist API error: ${response.status} ${response.statusText}` +
          (errorData.error ? ` - ${errorData.error}` : '')
        );
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No observations found');
      }
      
      // Process the observations to optimize the response
      const processedData = {
        ...data,
        results: data.results.map(observation => {
          // Extract and optimize image URLs
          let imageUrl = null;
          let originalUrl = null;
          let largeUrl = null;
          let mediumUrl = null;
          let baseUrl = null;
          
          if (observation.photos && observation.photos.length > 0) {
            const photo = observation.photos[0];
            
            // Store all available image URLs separately
            originalUrl = photo.original_url;
            largeUrl = photo.large_url;
            mediumUrl = photo.medium_url;
            baseUrl = photo.url;
            
            // Choose the best available image
            // Prefer medium-sized images for better loading performance
            imageUrl = photo.medium_url || photo.large_url || photo.original_url || photo.url;
            
            // Fix common iNaturalist URL issues
            if (imageUrl && imageUrl.includes('square')) {
              // Replace square thumbnails with regular images
              imageUrl = imageUrl.replace('square', 'medium');
            }
          }

          // Format date according to locale
          const date = new Date(observation.created_at);
          const formattedDate = date.toLocaleDateString(
            locale === 'sl' ? 'sl-SI' : 'en-US'
          );
          
          // Get localized name
          let formattedName = observation.species_guess;
          if (observation.taxon?.preferred_common_name) {
            formattedName = observation.taxon.preferred_common_name;
          }
          
          // Return optimized observation object
          return {
            ...observation,
            formattedName,
            imageUrl,
            originalUrl,
            largeUrl,
            mediumUrl,
            baseUrl,
            date: formattedDate
          };
        })
      };

      // Cache the result
      cache.set(cacheKey, processedData);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(processedData),
      };
      
    } catch (apiError) {
      console.error('iNaturalist API error, using mock data:', apiError);
      
      // Fall back to mock data if the API fails
      const mockObservations = generateMockObservations(perPage, locale);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockObservations),
      };
    }
    
  } catch (error) {
    console.error('Error in iNaturalist function:', error);
    
    // Return mock data as a last resort
    const mockObservations = generateMockObservations(3, 'en');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockObservations),
    };
  }
};
