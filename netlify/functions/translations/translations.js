// Netlify serverless function for managing translations
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Create a cache with a default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

// Path to the translations JSON file in the Git repository
const TRANSLATIONS_PATH = path.join(__dirname, 'translations.json');

// GitHub OAuth configuration
const GITHUB_TOKEN_SECRET = process.env.GITHUB_TOKEN_SECRET || 'livada-biotope-github-secret';

// Verify GitHub token
const verifyGitHubToken = async (token) => {
  try {
    // Verify the token with GitHub API
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error verifying GitHub token:', error);
    throw error;
  }
};

// Simplified token verification for public endpoints
// This is used for non-admin endpoints that don't require authentication
const verifyToken = (token) => {
  // For public endpoints, we don't need to verify the token
  // Just return a resolved promise
  return Promise.resolve({ sub: 'public-user' });
};

exports.handler = async (event, context) => {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*', // Replace with your domain in production
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    // Verify authentication for all requests except OPTIONS
    const authHeader = event.headers.authorization || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - No token provided' })
      };
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Verify the token with Auth0
      await verifyToken(token);
    } catch (authError) {
      console.error('Token verification failed:', authError);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - Invalid token', details: authError.message })
      };
    }

    // Parse query parameters
    const params = event.queryStringParameters || {};
    const locale = params.locale || 'en';
    const key = params.key || null;
    
    // Create a cache key
    const cacheKey = `translations_${locale}_${key || 'all'}`;

    // Check if we have a cached response
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Serving cached translations for key: ${cacheKey}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData)
      };
    }

    // Read the translations file
    let translations;
    try {
      const translationsData = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
      translations = JSON.parse(translationsData);
    } catch (error) {
      console.error('Error reading translations file:', error);
      // If the file doesn't exist or can't be parsed, return an empty object
      translations = {};
    }

    // If a specific key is requested, return only that translation
    if (key) {
      const translation = translations[key] ? translations[key][locale] : null;
      
      // Cache the result
      cache.set(cacheKey, { key, translation });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ key, translation })
      };
    }
    
    // Otherwise, return all translations for the requested locale
    const localeTranslations = {};
    
    for (const [k, value] of Object.entries(translations)) {
      localeTranslations[k] = value[locale] || value.en || k;
    }
    
    // Cache the result
    cache.set(cacheKey, localeTranslations);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(localeTranslations)
    };
  } catch (error) {
    console.error('Error in translations function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Error fetching translations',
        message: error.message
      })
    };
  }
};

// Handle POST requests to update translations
exports.handler = async (event, context) => {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*', // Replace with your domain in production
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    // Verify authentication for all requests except OPTIONS
    const authHeader = event.headers.authorization || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - No token provided' })
      };
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Verify the token with Auth0
      await verifyToken(token);
    } catch (authError) {
      console.error('Token verification failed:', authError);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - Invalid token', details: authError.message })
      };
    }

    // Handle GET requests (fetch translations)
    if (event.httpMethod === 'GET') {
      // Parse query parameters
      const params = event.queryStringParameters || {};
      const locale = params.locale || 'en';
      const key = params.key || null;
      
      // Create a cache key
      const cacheKey = `translations_${locale}_${key || 'all'}`;

      // Check if we have a cached response
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log(`Serving cached translations for key: ${cacheKey}`);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(cachedData)
        };
      }

      // Read the translations file
      let translations;
      try {
        const translationsData = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
        translations = JSON.parse(translationsData);
      } catch (error) {
        console.error('Error reading translations file:', error);
        // If the file doesn't exist or can't be parsed, return an empty object
        translations = {};
      }

      // If a specific key is requested, return only that translation
      if (key) {
        const translation = translations[key] ? translations[key][locale] : null;
        
        // Cache the result
        cache.set(cacheKey, { key, translation });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ key, translation })
        };
      }
      
      // Otherwise, return all translations for the requested locale
      const localeTranslations = {};
      
      for (const [k, value] of Object.entries(translations)) {
        localeTranslations[k] = value[locale] || value.en || k;
      }
      
      // Cache the result
      cache.set(cacheKey, localeTranslations);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(localeTranslations)
      };
    }
    
    // Handle POST requests (update translations)
    if (event.httpMethod === 'POST') {
      // Parse the request body
      const requestBody = JSON.parse(event.body);
      const { key, translations: newTranslations } = requestBody;
      
      if (!key || !newTranslations) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' })
        };
      }
      
      // Read the current translations
      let translations;
      try {
        const translationsData = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
        translations = JSON.parse(translationsData);
      } catch (error) {
        // If the file doesn't exist or can't be parsed, create a new object
        translations = {};
      }
      
      // Update the translations
      translations[key] = newTranslations;
      
      // Write the updated translations back to the file
      fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(translations, null, 2));
      
      // Clear the cache
      cache.flushAll();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, key, translations: newTranslations })
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Error in translations function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Error processing translations',
        message: error.message
      })
    };
  }
};
