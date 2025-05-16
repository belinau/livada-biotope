const fetch = require('node-fetch');

// Mock data for testing
const mockSensorData = [
  { id: 'sensor1', type: 'moisture', value: 35.7, timestamp: new Date().toISOString() },
  { id: 'sensor2', type: 'temperature', value: 22.4, timestamp: new Date().toISOString() },
  { id: 'sensor3', type: 'humidity', value: 68.2, timestamp: new Date().toISOString() }
];

// Handle requests based on path and method
exports.handler = async function(event, context) {
  console.log("Sideband bridge function invoked");
  console.log("Path:", event.path);
  console.log("HTTP method:", event.httpMethod);
  console.log("Query params:", event.queryStringParameters);
  
  // Set CORS headers to allow requests from any origin
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: ""
    };
  }

  // Extract endpoint from path
  let endpoint = "";
  
  // Handle different path patterns
  if (event.path.includes('/api/sideband/')) {
    endpoint = event.path.split('/api/sideband/')[1];
  } else if (event.path.includes('/.netlify/functions/sideband-bridge/')) {
    endpoint = event.path.split('/.netlify/functions/sideband-bridge/')[1];
  } else if (event.path === '/.netlify/functions/sideband-bridge') {
    // Handle root path with query parameters
    endpoint = event.queryStringParameters?.endpoint || 'status';
  } else if (event.path.includes('/api/')) {
    endpoint = event.path.split('/api/')[1];
  }

  console.log("Extracted endpoint:", endpoint);

  try {
    // Handle different endpoints
    switch(endpoint) {
      case 'status':
      case 'test-connection':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            status: "online",
            version: "1.0.0",
            timestamp: new Date().toISOString()
          })
        };
        
      case 'data':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockSensorData)
        };
        
      case 'debug':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            request: {
              path: event.path,
              httpMethod: event.httpMethod,
              headers: event.headers,
              queryStringParameters: event.queryStringParameters || {}
            },
            environment: {
              NODE_ENV: process.env.NODE_ENV || 'development'
            }
          })
        };
        
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Endpoint not found", endpoint })
        };
    }
  } catch (error) {
    console.error("Error in sideband-bridge function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", message: error.message })
    };
  }
  if (!endpoint && event.queryStringParameters && event.queryStringParameters.endpoint) {
    endpoint = event.queryStringParameters.endpoint;
  }

  console.log("Extracted endpoint:", endpoint);
  
  // Handle requests based on endpoint
  try {
    // Handle test connection request
    if (endpoint === 'test-connection' || endpoint === 'status') {
      console.log("Handling status endpoint");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "online",
          version: "1.0.0",
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // Handle data request
    if (endpoint === 'data') {
      console.log("Handling data endpoint");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockSensorData)
      };
    }
    
    // Handle debug request
    if (endpoint === 'debug') {
      console.log("Handling debug endpoint");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          request: {
            path: event.path,
            httpMethod: event.httpMethod,
            headers: event.headers,
            queryStringParameters: event.queryStringParameters || {}
          },
          environment: {
            SIDEBAND_HOST: process.env.NEXT_PUBLIC_SIDEBAND_HOST || 'Not configured',
            SIDEBAND_PORT: process.env.NEXT_PUBLIC_SIDEBAND_PORT || 'Not configured',
            SIDEBAND_HASH: process.env.NEXT_PUBLIC_SIDEBAND_HASH || 'Not configured',
            NODE_ENV: process.env.NODE_ENV || 'development'
          }
        })
      };
    }
    
    // Handle reticulum link request - this would establish a link in a real implementation
    if (endpoint === 'link' || endpoint === 'connect') {
      console.log("Handling link/connect endpoint");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "connected",
          link_id: "mock-link-" + Date.now(),
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // Return 404 for unknown endpoints
    console.log("Unknown endpoint:", endpoint);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Unknown endpoint", requestedEndpoint: endpoint })
    };
  } catch (error) {
    console.error("Error in sideband-bridge function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", message: error.message })
    };
  }
};
