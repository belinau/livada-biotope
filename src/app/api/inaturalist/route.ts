import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';

// Create a cache with a default TTL of 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

// Function to generate mock observation data when the API fails
function generateMockObservations(count: number, locale: string) {
  const mockSpecies = [
    {
      id: '1',
      species_guess: locale === 'sl' ? 'Navadna leska' : 'Common Hazel',
      uri: 'https://www.inaturalist.org/observations/1',
      user: { login: 'livada_admin', name: 'Livada Admin' },
      taxon: {
        id: 101,
        name: 'Corylus avellana',
        preferred_common_name: locale === 'sl' ? 'Navadna leska' : 'Common Hazel'
      },
      photos: [{
        medium_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/1234/medium.jpg',
        large_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/1234/large.jpg'
      }],
      created_at: new Date().toISOString(),
      place_guess: 'Ljubljana, Slovenia'
    },
  ];

  return { results: mockSpecies.slice(0, count) };
}

// Maximum number of items per page to prevent abuse
const MAX_ITEMS_PER_PAGE = 20;

export const dynamic = 'force-dynamic'; // Force dynamic route behavior

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(MAX_ITEMS_PER_PAGE, Math.max(1, parseInt(searchParams.get('per_page') || '6', 10)));
    const locale = searchParams.get('locale') || 'en';
    const projectId = searchParams.get('project_id') || 'the-livada-biotope-monitoring';

    // Generate a cache key based on the request parameters
    const cacheKey = `inat-${projectId}-${page}-${perPage}-${locale}`;
    
    // Try to get cached data first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // iNaturalist API endpoint for the Livada Biotope project
    const apiUrl = new URL('https://api.inaturalist.org/v1/observations');
    apiUrl.searchParams.append('project_id', projectId);
    apiUrl.searchParams.append('verifiable', 'any');
    apiUrl.searchParams.append('order', 'desc');
    apiUrl.searchParams.append('order_by', 'created_at');
    apiUrl.searchParams.append('per_page', perPage.toString());
    apiUrl.searchParams.append('page', page.toString());
    apiUrl.searchParams.append('photos', 'true');
    apiUrl.searchParams.append('locale', locale);

    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(apiUrl.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`iNaturalist API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the successful response
      cache.set(cacheKey, data);
      
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching from iNaturalist API, falling back to mock data:', error);
      
      // Return mock data when the API fails
      const mockData = generateMockObservations(perPage, locale);
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error('Error in iNaturalist API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch observations' },
      { status: 500 }
    );
  }
}

export async function GETDynamic(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '12';
  
  try {
    const response = await fetch(
      `https://api.inaturalist.org/v1/observations?project_id=biotop-livada&per_page=${limit}&order=desc&order_by=created_at`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch observations');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in iNaturalist API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch iNaturalist data' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
