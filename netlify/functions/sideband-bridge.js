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
  
  console.log("Sideband bridge function called with path:", event.path, "and method:", event.httpMethod);
  
  // Extract the endpoint from various possible path formats
  let endpoint = '';
  
  // Handle different path patterns:
  // 1. /api/sideband/status
  // 2. /.netlify/functions/sideband-bridge/status
  // 3. /api/sideband/test-connection
  // 4. ...etc
  
  if (event.path.includes('/test-connection')) {
    endpoint = 'status'; // Map test-connection to status endpoint
  } else if (event.path.includes('/status')) {
    endpoint = 'status';
  } else if (event.path.includes('/data')) {
    endpoint = 'data';
  } else if (event.path.includes('/debug')) {
    endpoint = 'debug';
  } else {
    // Default to data if no specific endpoint
    endpoint = 'data';
  }
  
  console.log("Mapped to endpoint:", endpoint);
  
  try {
    // Handle different API endpoints
    if (endpoint === 'data') {
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
    else if (endpoint === 'status') {
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
          originalPath: event.path,
          mappedEndpoint: endpoint,
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
        message: "Available endpoints: /data, /status, /test-connection, /debug",
        requestedPath: event.path
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
