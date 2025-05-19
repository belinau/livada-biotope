import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';

// Create a cache with a default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

// Mock data for testing
const mockSensorData = [
  { id: 'sensor1', type: 'moisture', value: 35.7, timestamp: new Date().toISOString() },
  { id: 'sensor2', type: 'temperature', value: 22.4, timestamp: new Date().toISOString() },
  { id: 'sensor3', type: 'humidity', value: 68.2, timestamp: new Date().toISOString() }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'status';
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    // Handle different endpoints
    if (endpoint === 'status' || endpoint === 'test-connection') {
      return NextResponse.json({
        status: "online",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }, { headers });
    }
    
    if (endpoint === 'data') {
      return NextResponse.json(mockSensorData, { headers });
    }
    
    if (endpoint === 'debug') {
      return NextResponse.json({
        request: {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          searchParams: Object.fromEntries(searchParams.entries())
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV || 'development',
          SIDEBAND_HOST: process.env.NEXT_PUBLIC_SIDEBAND_HOST || 'Not configured',
          SIDEBAND_PORT: process.env.NEXT_PUBLIC_SIDEBAND_PORT || 'Not configured',
          SIDEBAND_HASH: process.env.NEXT_PUBLIC_SIDEBAND_HASH || 'Not configured'
        }
      }, { headers });
    }
    
    // Handle reticulum link request
    if (endpoint === 'link' || endpoint === 'connect') {
      return NextResponse.json({
        status: "connected",
        link_id: "mock-link-" + Date.now(),
        timestamp: new Date().toISOString()
      }, { headers });
    }
    
    // Return 404 for unknown endpoints
    return NextResponse.json({
      error: "Endpoint not found",
      requestedEndpoint: endpoint,
      availableEndpoints: [
        'status',
        'data',
        'debug',
        'connect'
      ]
    }, { 
      status: 404,
      headers 
    });
    
  } catch (error) {
    console.error("Error in sideband API:", error);
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers 
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    }
  });
}
