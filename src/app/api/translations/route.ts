import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import NodeCache from 'node-cache';

// Create a cache with a default TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

// Path to the translations directory in the public folder
const LOCALES_PATH = path.join(process.cwd(), 'public/locales');

// Add CORS headers to a response
function withCors(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle GET requests for translations
async function handleGet(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const cacheKey = `translations-${locale}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return withCors(NextResponse.json(cached));
  }

  try {
    // Read from file
    const filePath = path.join(LOCALES_PATH, `${locale}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    // Cache the result
    cache.set(cacheKey, translations);
    
    return withCors(NextResponse.json(translations));
  } catch (error) {
    console.error(`Error reading translations for ${locale}:`, error);
    return withCors(
      NextResponse.json(
        { error: `Failed to load translations for ${locale}` },
        { status: 500 }
      )
    );
  }
}

// Handle OPTIONS for CORS preflight
function handleOptions() {
  const response = new NextResponse(null, { status: 204 });
  return withCors(response);
}

// Main request handler
async function handler(request: Request) {
  try {
    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }
    
    // Handle GET requests
    if (request.method === 'GET') {
      return handleGet(request);
    }
    
    // Method not allowed
    return withCors(
      NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      )
    );
    
  } catch (error) {
    console.error('Error in translations API:', error);
    return withCors(
      NextResponse.json(
        { 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error' 
        },
        { status: 500 }
      )
    );
  }
}

export { handler as GET, handler as OPTIONS };
