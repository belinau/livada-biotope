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
  } else if (event.path.endsWith('/sideband-bridge')) {
    // Handle root path with query parameters
    endpoint = event.queryStringParameters?.endpoint || 'status';
  } else if (event.path.includes('/api/')) {
    endpoint = event.path.split('/api/')[1];
  }

  console.log("Extracted endpoint:", endpoint);

  try {
    // Handle different endpoints
    if (endpoint === 'status' || endpoint === 'test-connection') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "online",
          version: "1.0.0",
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          functions: {
            sideband: "/.netlify/functions/sideband-bridge/status",
            translations: "/.netlify/functions/translations",
            calendar: "/.netlify/functions/calendar",
            inaturalist: "/.netlify/functions/inaturalist"
          }
        })
      };
    }
    
    if (endpoint === 'data') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockSensorData)
      };
    }
    
    if (endpoint === 'debug') {
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
            NODE_ENV: process.env.NODE_ENV || 'development',
            SIDEBAND_HOST: process.env.NEXT_PUBLIC_SIDEBAND_HOST || 'Not configured',
            SIDEBAND_PORT: process.env.NEXT_PUBLIC_SIDEBAND_PORT || 'Not configured',
            SIDEBAND_HASH: process.env.NEXT_PUBLIC_SIDEBAND_HASH || 'Not configured'
          }
        })
      };
    }
    
    // Handle reticulum link request
    if (endpoint === 'link' || endpoint === 'connect') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "connected",
          message: "Connection successful",
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // Default response for unknown endpoints
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: "Endpoint not found",
        path: event.path,
        availableEndpoints: [
          "/status",
          "/data",
          "/debug",
          "/link"
        ]
      })
    };
    
  } catch (error) {
    console.error("Error in sideband-bridge:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message
      })
    };
  }
};
