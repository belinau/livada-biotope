// Use the built-in fetch if available (Node.js 18+), otherwise use node-fetch
let fetchImpl;
try {
  // In newer Node.js versions, fetch is available globally
  fetchImpl = globalThis.fetch || require('node-fetch');
} catch (e) {
  // Fallback to node-fetch
  try {
    fetchImpl = require('node-fetch');
  } catch (innerError) {
    console.error('[calendar-proxy] Failed to load fetch implementation:', innerError);
    // We'll handle this error in the handler function
    fetchImpl = null;
  }
}

exports.handler = async (event, context) => {
  // Check if fetch is available
  if (!fetchImpl) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Fetch implementation not available',
        details: 'The fetch function is not available in this environment'
      })
    };
  }

  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'URL parameter is required' })
    };
  }

  // Decode the URL since it's encoded in the query parameter
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch (decodeError) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Invalid URL encoding',
        details: decodeError.message,
        url: url
      })
    };
  }

  try {
    console.log(`[calendar-proxy] Fetching calendar from: ${decodedUrl}`);
    
    const response = await fetchImpl(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'Accept': 'text/calendar, text/plain, */*'
      }
    });
    
    console.log(`[calendar-proxy] Calendar fetch response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[calendar-proxy] Calendar fetch failed with status ${response.status}: ${errorText}`);
      
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: `Calendar server returned error: ${response.status}`,
          status: response.status,
          statusText: response.statusText,
          details: errorText.substring(0, 500), // Limit error text length
          url: decodedUrl
        })
      };
    }
    
    const icsData = await response.text();
    console.log(`[calendar-proxy] Successfully fetched ${icsData.length} characters of calendar data`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'X-Proxied-Url': decodedUrl
      },
      body: icsData
    };
  } catch (error) {
    console.error(`[calendar-proxy] Error fetching calendar:`, error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to fetch calendar data',
        details: error.message,
        url: decodedUrl
      })
    };
  }
};