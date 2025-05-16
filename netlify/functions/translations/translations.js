// Netlify serverless function for managing translations
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

// Create a cache with a default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

// Path to the translations directory - use process.cwd() for Netlify environment
const LOCALES_PATH = path.join(process.cwd(), 'public/locales');

// Handler for the Netlify function
exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

  try {
    // Handle GET request - fetch translations
    if (event.httpMethod === 'GET') {
      const { locale = 'en' } = event.queryStringParameters || {};
      
      // Check cache first
      const cacheKey = `translations-${locale}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(cached)
        };
      }

      // Read from file
      const filePath = path.join(LOCALES_PATH, `${locale}.json`);
      
      try {
        const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Cache the result
        cache.set(cacheKey, translations);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(translations)
        };
      } catch (error) {
        console.error(`Error reading translations for ${locale}:`, error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: `Failed to load translations for ${locale}` })
        };
      }
    }

    // Handle POST request - update translations (disabled in production)
    if (event.httpMethod === 'POST') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Direct updates to translations are disabled' })
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
    
  } catch (error) {
    console.error('Error in translations function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
