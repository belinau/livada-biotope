import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
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
      created_at: '2023-05-15T12:30:45Z',
      place_guess: 'Ljubljana, Slovenia'
    },
    {
      id: '2',
      species_guess: locale === 'sl' ? 'Navadni pljučnik' : 'Common Lungwort',
      uri: 'https://www.inaturalist.org/observations/2',
      user: { login: 'livada_admin', name: 'Livada Admin' },
      taxon: {
        id: 102,
        name: 'Pulmonaria officinalis',
        preferred_common_name: locale === 'sl' ? 'Navadni pljučnik' : 'Common Lungwort'
      },
      photos: [{
        medium_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/2345/medium.jpg',
        large_url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/2345/large.jpg'
      }],
      created_at: '2023-05-16T14:22:33Z',
      place_guess: 'Ljubljana, Slovenia'
    }
  ];
  
  return { results: mockSpecies.slice(0, count) };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const count = Math.min(parseInt(searchParams.get('count') || '10'), 20);
  
  const cacheKey = `inaturalist-${locale}-${count}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return NextResponse.json(cached);
  }
  
  try {
    // Try to fetch from iNaturalist API
    const response = await fetch(
      `https://api.inaturalist.org/v1/observations?place_id=113055&per_page=${count}&order=desc&order_by=created_at`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch from iNaturalist');
    
    const data = await response.json();
    cache.set(cacheKey, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('iNaturalist API error, using mock data:', error);
    const mockData = generateMockObservations(count, locale);
    return NextResponse.json(mockData);
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
