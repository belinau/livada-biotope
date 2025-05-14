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
  
  console.log("Sideband bridge function called with path:", event.path);
  
  // Extract path and parameters - handle various path formats
  const path = event.path
    .replace('/.netlify/functions/sideband-bridge', '')
    .replace('/api/sideband', '')
    .replace('/api', '');
    
  const segments = path.split('/').filter(Boolean);
  const endpoint = segments[0] || '';
  
  console.log("Extracted endpoint:", endpoint);
  
  try {
    // Handle different API endpoints
    if (endpoint === 'data' || endpoint === '') {
      // Return sensor data
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
      
      console.log("Returning sensor data");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } 
    else if (endpoint === 'status' || endpoint === 'test-connection') {
      // Return status information
      const status = {
        status: "online",
        timestamp: new Date().toISOString(),
        environment: process.env.CONTEXT || 'netlify',
        sideband_hash: process.env.NEXT_PUBLIC_SIDEBAND_HASH || 'not set'
      };
      
      console.log("Returning status:", status);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(status)
      };
    }
    else if (endpoint === 'debug') {
      // Return debug information
      const debugInfo = {
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
      };
      
      console.log("Returning debug info");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(debugInfo)
      };
    }
    
    // If no recognized endpoint is found
    console.log("Endpoint not found:", endpoint);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: "Not found",
        message: "Available endpoints: /data, /status, /test-connection, /debug"
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
