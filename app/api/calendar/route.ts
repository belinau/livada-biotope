import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';
import ical from 'ical.js';
import { z } from 'zod';

// Create a cache with a default TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

// Google Calendar iCal URL (should be moved to environment variables)
const CALENDAR_URL = process.env.CALENDAR_ICAL_URL || 
  "https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics";

// Type definitions for translations
interface Translation {
  workshop: string;
  lecture: string;
  community: string;
  other: string;
  [key: string]: string;
}

// Simple translations for event types and common words
const translations: Record<string, Translation> = {
  en: {
    workshop: "Workshop",
    lecture: "Lecture",
    community: "Community Event",
    other: "Event"
  },
  sl: {
    workshop: "Delavnica",
    lecture: "Predavanje",
    community: "Skupnostni dogodek",
    other: "Dogodek"
  }
};

// Common event-related terms translations for Slovenian
const commonTerms: Record<string, string> = {
  // Event types
  'workshop': 'delavnica',
  'lecture': 'predavanje',
  'community': 'skupnost',
  'meeting': 'srečanje',
  
  // Locations
  'Livada Biotope': 'Biotop Livada',
  'Community Garden': 'Skupnostni vrt',
  'Botanical Garden': 'Botanični vrt',
  'Urban Garden': 'Mestni vrt',
  'City Park': 'Mestni park',
  'Nature Reserve': 'Naravni rezervat',
  'Forest': 'Gozd',
  'Meadow': 'Travnik',
  'Online': 'Spletno',
  'Biotop Livada': 'Biotop Livada',
  'LivadaLAB': 'LivadaLAB',
  
  // Common words in event titles
  'Permacultural': 'Permakulturna',
  'introduction': 'uvod',
  'advanced': 'napredni tečaj',
  'for beginners': 'za začetnike',
  'seminar': 'seminar',
  'conference': 'konferenca',
  'gathering': 'druženje',
  'presentation': 'predstavitev',
  'exhibition': 'razstava',
  'fair': 'sejem',
  'market': 'tržnica',
  'sale': 'razprodaja',
  'volunteer': 'prostovoljci',
  'maintenance': 'vzdrževanje',
  'planting': 'saditev',
  'harvest': 'pridelek',
  'composting': 'kompostiranje',
  'beekeeping': 'čebelarjenje',
  'gardening': 'vrtnarjenje',
  'permaculture': 'permakultura',
  'sustainability': 'trajnostni razvoj',
  'ecology': 'ekologija',
  'biodiversity': 'biotska raznovrstnost',
  'organic': 'ekološko',
  'sustainable': 'trajnostno',
  'local': 'lokalno',
  'seasonal': 'poletni',
  'winter': 'zimski',
  'spring': 'spomladanski',
  'summer': 'poletni',
  'autumn': 'jesenski',
  'fall': 'jesenski',
  'family': 'družinski',
  'children': 'otroci',
  'kids': 'otroci',
  'adults': 'odrasli',
  'seniors': 'upokojenci',
  'beginners': 'začetniki',
  'experts': 'strokovnjaki',
  'professionals': 'poklicni',
  'amateur': 'amaterji',
  'hobby': 'hobiji',
  'educational': 'izobraževalni',
  'practical': 'praktični',
  'theoretical': 'teoretični',
  'hands-on': 'praktični',
  'demonstration': 'demonstracija',
  'tutorial': 'vadnica',
  'course': 'tečaj'
};

interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
  type: string;
  typeLabel: string;
}

// Helper function to translate common terms in text
function translateCommonTerms(text: string, locale: string): string {
  if (!text || locale !== 'sl') return text;
  
  let translated = text;
  Object.entries(commonTerms).forEach(([en, sl]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, sl);
  });
  return translated;
}

// Helper function to determine event type based on title and description
function determineEventType(summary: string, description: string = ''): string {
  const text = `${summary} ${description}`.toLowerCase();
  
  if (text.includes('workshop') || text.includes('delavnica')) return 'workshop';
  if (text.includes('lecture') || text.includes('predavanje')) return 'lecture';
  if (text.includes('community') || text.includes('skupnost')) return 'community';
  
  return 'other';
}

// Helper function to translate event titles and descriptions
function translateEventTitle(text: string, locale: string): string {
  if (!text) return '';
  return translateCommonTerms(text, locale);
}

const eventSchema = z.object({
  start: z.string(),
  end: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const maxResults = parseInt(searchParams.get('maxResults') || '10', 10);

  try {
    const cacheKey = `calendar-events-${locale}-${maxResults}`;
    const cached = cache.get<CalendarEvent[]>(cacheKey);
    
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetch(CALENDAR_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.statusText}`);
    }
    
    const icsData = await response.text();
    
    // Parse the iCal data
    const jcalData = ical.parse(icsData);
    const component = new ical.Component(jcalData);
    const events = component.getAllSubcomponents('vevent');
    
    const now = new Date();
    const futureEvents: CalendarEvent[] = [];

    events.forEach((event) => {
      const summary = event.getFirstPropertyValue('summary');
      const description = event.getFirstPropertyValue('description') || '';
      const location = event.getFirstPropertyValue('location') || '';
      const start = event.getFirstPropertyValue('dtstart');
      const end = event.getFirstPropertyValue('dtend');
      const uid = event.getFirstPropertyValue('uid');
      
      if (!start || new Date(start).getTime() < now.getTime()) return; // Skip past events
      
      const eventType = determineEventType(summary, description);
      
      futureEvents.push({
        id: uid,
        summary: translateEventTitle(summary, locale),
        description: translateEventTitle(description, locale),
        start: start.toISOString(),
        end: end ? end.toISOString() : null,
        location: translateEventTitle(location, locale),
        type: eventType,
        typeLabel: translations[locale]?.[eventType] || translations[locale]?.other || 'Event'
      });
    });

    // Validate events
    const validatedEvents = futureEvents.filter((event) => {
      const result = eventSchema.safeParse(event);
      return result.success;
    });

    // Sort by date and limit results
    validatedEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const result = validatedEvents.slice(0, maxResults);
    
    // Cache the result
    cache.set(cacheKey, result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error fetching or parsing calendar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar data' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
