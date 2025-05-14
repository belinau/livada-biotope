// Sideband bridge implemented as a Netlify serverless function
exports.handler = async (event, context) => {
  // Set up CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // Extract path and parameters
  const path = event.path.replace('/.netlify/functions/sideband-bridge', '');
  const segments = path.split('/').filter(Boolean);
  const endpoint = segments[0] || '';
  
  try {
    // Handle different API endpoints
    if (endpoint === 'data' || event.path.includes('/api/data')) {
      // Return mock sensor data
      const now = new Date();
      const data = [
        {
          timestamp: now.toISOString(),
          sensorId: 1,
          moisture: 45 + (Math.sin(now.getHours() / 24 * Math.PI * 2) * 10) + (Math.random() * 5)
        },
        {
          timestamp: now.toISOString(),
          sensorId: 2,
          moisture: 30 + (Math.cos(now.getHours() / 24 * Math.PI * 2) * 15) + (Math.random() * 5)
        }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } 
    else if (endpoint === 'status' || event.path.includes('/api/status')) {
      // Return status information
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "online",
          timestamp: new Date().toISOString(),
          environment: process.env.CONTEXT || 'unknown',
          sideband_hash: process.env.NEXT_PUBLIC_SIDEBAND_HASH || 'not set'
        })
      };
    }
    else if (endpoint === 'debug' || event.path.includes('/api/debug')) {
      // Return debug information
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          system: {
            nodejs_version: process.version,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            deployment: process.env.CONTEXT
          },
          request: {
            method: event.httpMethod,
            path: event.path,
            headers: event.headers,
            queryStringParameters: event.queryStringParameters
          }
        })
      };
    }
    // If no recognized endpoint is found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: "Not found",
        message: "Available endpoints: /data, /status, /debug, /api/data, /api/status, /api/debug"
      })
    };
    
  } catch (error) {
    // Log error and return error response
    console.error('Error in sideband-bridge function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error", message: error.message })
    };
  }
};
