import { NextResponse } from 'next/server';
import { URLSearchParams } from 'url';

// Mock data for testing
const mockSensorData = [
  { id: 'sensor1', type: 'moisture', value: 35.7, timestamp: new Date().toISOString() },
  { id: 'sensor2', type: 'temperature', value: 22.4, timestamp: new Date().toISOString() },
  { id: 'sensor3', type: 'humidity', value: 68.2, timestamp: new Date().toISOString() }
];

// Interface for API response
interface ApiResponse {
  status: number;
  body: any;
  headers?: Record<string, string>;
}

// Add CORS headers to response
function withCors(response: ApiResponse): ApiResponse {
  return {
    ...response,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
      ...response.headers
    }
  };
}

// Handle different endpoints
async function handleEndpoint(endpoint: string, searchParams: URLSearchParams): Promise<ApiResponse> {
  switch (endpoint) {
    case 'status':
    case 'test-connection':
      return {
        status: 200,
        body: {
          status: "online",
          version: "1.0.0",
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          functions: {
            sideband: "/api/sideband/status",
            translations: "/api/translations",
            calendar: "/api/calendar",
            inaturalist: "/api/inaturalist",
            sensorBackup: "/api/sensor-backup"
          }
        }
      };
    
    case 'sensors':
      return {
        status: 200,
        body: mockSensorData
      };
      
    case 'sensor':
      const sensorId = searchParams.get('id');
      if (!sensorId) {
        return {
          status: 400,
          body: { error: 'Sensor ID is required' }
        };
      }
      
      const sensor = mockSensorData.find(s => s.id === sensorId);
      if (!sensor) {
        return {
          status: 404,
          body: { error: 'Sensor not found' }
        };
      }
      
      return {
        status: 200,
        body: sensor
      };
      
    default:
      return {
        status: 404,
        body: { error: 'Endpoint not found' }
      };
  }
}

// Main handler
async function handler(request: Request) {
  try {
    // Handle OPTIONS for CORS preflight
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      const corsResponse = withCors({ status: 204, body: null });
      Object.entries(corsResponse.headers || {}).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
    
    // Only allow GET requests
    if (request.method !== 'GET') {
      return new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405 }
      );
    }
    
    // Parse URL and handle endpoint
    const url = new URL(request.url);
    const endpoint = url.pathname.split('/').pop() || 'status';
    const searchParams = new URLSearchParams(url.search);
    
    const result = await handleEndpoint(endpoint, searchParams);
    const response = NextResponse.json(result.body, { status: result.status });
    
    // Add CORS headers
    Object.entries(result.headers || {}).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
    
  } catch (error) {
    console.error('Sideband API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return withCors({
      status: 500,
      body: { error: 'Internal server error' },
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export { handler as GET, handler as OPTIONS };
