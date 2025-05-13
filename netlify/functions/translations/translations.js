// Netlify serverless function for managing translations
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

// Create a cache with a default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

// Path to the translations JSON file in the Git repository
const TRANSLATIONS_PATH = path.join(__dirname, 'translations.json');
// Path to the public translations JSON file for Netlify CMS
const PUBLIC_TRANSLATIONS_PATH = path.join(__dirname, '../../../public/translations.json');

// Function to sync translations between files
const syncTranslationFiles = (data) => {
  try {
    // Write to both locations
    fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(data, null, 2));
    fs.writeFileSync(PUBLIC_TRANSLATIONS_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error syncing translation files:', error);
    return false;
  }
};

// Handler for the Netlify function
exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Handle GET request - fetch translations
  if (event.httpMethod === 'GET') {
    try {
      // Check if we have the translations in cache
      const cacheKey = 'translations';
      let translations = cache.get(cacheKey);
      
      if (!translations) {
        // If not in cache, read from file
        try {
          // Try to read from the public path first (Netlify CMS managed)
          translations = JSON.parse(fs.readFileSync(PUBLIC_TRANSLATIONS_PATH, 'utf8'));
        } catch (publicReadError) {
          console.warn('Error reading from public translations, falling back to function translations:', publicReadError);
          
          try {
            // Fallback to the function's local copy
            translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));
          } catch (fallbackReadError) {
            console.error('Error reading translations from fallback location:', fallbackReadError);
            translations = {}; // Empty object as last resort
          }
        }
        
        // Store in cache for future requests
        cache.set(cacheKey, translations);
      }
      
      // Get locale from query string
      const { locale } = event.queryStringParameters || {};
      
      // If locale is specified, filter translations for that locale
      if (locale && (locale === 'en' || locale === 'sl')) {
        const localeTranslations = {};
        
        // Filter translations for the requested locale
        Object.keys(translations).forEach(key => {
          if (translations[key] && typeof translations[key] === 'object' && translations[key][locale]) {
            localeTranslations[key] = translations[key][locale];
          }
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(localeTranslations)
        };
      }
      
      // Return all translations if no locale specified
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(translations)
      };
    } catch (error) {
      console.error('Error handling GET request:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch translations' })
      };
    }
  }
  
  // Handle POST request - update translations (for Netlify CMS)
  if (event.httpMethod === 'POST') {
    try {
      // Parse the request body
      const data = JSON.parse(event.body);
      
      // Sync the translations between files
      const success = syncTranslationFiles(data);
      
      if (success) {
        // Update the cache
        cache.set('translations', data);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Translations updated successfully' })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to update translations' })
        };
      }
    } catch (error) {
      console.error('Error handling POST request:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update translations' })
      };
    }
  }
  
  // Handle unsupported methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
