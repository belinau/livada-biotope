import { NextResponse } from 'next/server';
import { createEvent, DateArray, EventAttributes } from 'ics';
import NodeCache from 'node-cache';

// Define the event type for the API response
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  type: string;
  url?: string;
  allDay?: boolean;
}

// Create a cache with a default TTL of 30 minutes (1800 seconds)
const cache = new NodeCache({ stdTTL: 1800 });

// Google Calendar iCal URL (public)
const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics';

// Helper function to convert Date to DateArray
export function toDateArray(date: Date): DateArray {
  return [
    date.getFullYear(),
    date.getMonth() + 1, // Months are 0-indexed in JS
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
}

// Mock data for testing
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Community Garden Day',
    description: 'Join us for a day of gardening and community building',
    location: 'Main Garden',
    start: new Date('2025-06-15T10:00:00'),
    end: new Date('2025-06-15T16:00:00'),
    type: 'workshop',
    url: 'https://example.com/events/community-garden-day',
  },
  {
    id: '2',
    title: 'Harvest Festival',
    description: 'Celebrate the harvest season with food, music, and activities',
    location: 'Farm Area',
    start: new Date('2025-07-20T12:00:00'),
    end: new Date('2025-07-20T20:00:00'),
    type: 'festival',
    url: 'https://example.com/events/harvest-festival',
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') as 'en' | 'sl') || 'en';
    const cacheKey = `calendar-${locale}`;
    
    // Try to get cached data first
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return new NextResponse(cachedResponse as string, {
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename=livada-biotope.ics',
        },
      });
    }

    // In a real app, you would fetch events from a database or external API
    const events = mockEvents; // Replace with actual data source

    // Filter out past events
    const now = new Date();
    const futureEvents = events.filter((event) => event.end > now);

    // Generate iCal content
    const icsEvents: EventAttributes[] = futureEvents.map((event) => ({
      start: toDateArray(event.start),
      end: toDateArray(event.end),
      title: event.title,
      description: event.description,
      location: event.location,
      url: event.url,
      status: 'CONFIRMED' as const,
      busyStatus: 'BUSY' as const,
      categories: [event.type],
      startInputType: 'utc',
      startOutputType: 'utc',
      endInputType: 'utc',
      endOutputType: 'utc',
    }));

    // Generate the iCal file content
    const { value: icsContent, error } = createEvents(icsEvents);
    
    if (error) {
      console.error('Error generating iCal:', error);
      return new NextResponse('Error generating calendar', { status: 500 });
    }

    // Cache the response
    if (icsContent) {
      cache.set(cacheKey, icsContent);
    }

    // Return the iCal file
    return new NextResponse(icsContent || '', {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename=livada-biotope.ics',
      },
    });
  } catch (error) {
    console.error('Error in calendar API:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// Helper function to create multiple events
export function createEvents(events: Parameters<typeof createEvent>[0][]) {
  const results: string[] = [];
  let error: Error | null = null;
  
  for (const event of events) {
    try {
      const result = createEvent(event);
      if (result.value) {
        results.push(result.value);
      }
    } catch (err) {
      error = err as Error;
      break;
    }
  }
  
  if (error) {
    return { value: null, error };
  }
  
  return { value: results.join('\n'), error: null };
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Set the revalidation time for this route (in seconds)
export const revalidate = 3600; // Revalidate every hour
