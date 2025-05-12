// Netlify serverless function to fetch and cache iNaturalist observations
const fetch = require('node-fetch');
const NodeCache = require('node-cache');

// Create a cache with a default TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

exports.handler = async (event, context) => {
  try {
    // Set CORS headers to allow requests from your domain
    const headers = {
      'Access-Control-Allow-Origin': '*', // Replace with your domain in production
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle OPTIONS request (preflight)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight request successful' })
      };
    }

    // Parse query parameters
    const params = event.queryStringParameters || {};
    const page = parseInt(params.page) || 1;
    const perPage = parseInt(params.per_page) || 6;
    const locale = params.locale || 'en';
    const projectId = params.project_id || 'the-livada-biotope-monitoring';

    // Create a cache key based on the request parameters
    const cacheKey = `inaturalist_${projectId}_${page}_${perPage}_${locale}`;

    // Check if we have a cached response
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Serving cached iNaturalist data for key: ${cacheKey}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData)
      };
    }

    // Construct the API URL
    const apiUrl = `https://api.inaturalist.org/v1/observations?project_id=${projectId}&verifiable=any&order=desc&order_by=created_at&per_page=${perPage}&page=${page}&locale=${locale}`;

    // Add user agent to avoid being blocked
    const fetchOptions = {
      headers: {
        'User-Agent': 'LivadaBiotope/1.0 (https://livada-biotope.netlify.app/)'
      }
    };

    // Fetch data from iNaturalist API
    console.log(`Fetching iNaturalist data from: ${apiUrl}`);
    const response = await fetch(apiUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`iNaturalist API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Process the observations to optimize the response
    const processedData = {
      ...data,
      results: data.results.map(observation => {
        // Extract and optimize image URLs
        let imageUrl = null;
        let fallbackUrls = {};
        
        if (observation.photos && observation.photos.length > 0) {
          const photo = observation.photos[0];
          
          // Collect all available image URLs
          fallbackUrls = {
            original: photo.original_url,
            large: photo.large_url,
            medium: photo.medium_url,
            small: photo.url
          };
          
          // Choose the best available image
          imageUrl = photo.large_url || photo.original_url || photo.medium_url || photo.url;
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
          id: observation.id,
          species_guess: observation.species_guess,
          formattedName,
          uri: observation.uri,
          user: {
            login: observation.user.login,
            name: observation.user.name
          },
          imageUrl,
          fallbackUrls,
          date: formattedDate,
          created_at: observation.created_at,
          place_guess: observation.place_guess,
          // Include taxon info for scientific names
          taxon: observation.taxon ? {
            id: observation.taxon.id,
            name: observation.taxon.name,
            preferred_common_name: observation.taxon.preferred_common_name
          } : null
        };
      })
    };

    // Store the processed data in cache
    cache.set(cacheKey, processedData);
    
    // Return the processed data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(processedData)
    };
  } catch (error) {
    console.error('Error in iNaturalist function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Error fetching iNaturalist data',
        message: error.message
      })
    };
  }
};
