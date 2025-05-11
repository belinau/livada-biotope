import { translateEventTitle, translateEventDescription, translateEventLocation } from '@/lib/translationService';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Get current language from context or props, don't use localStorage directly
// to avoid refresh loops
let cachedLanguage: 'en' | 'sl' = 'en';

// Cache for calendar events to improve performance
interface EventCache {
  events: CalendarEvent[];
  timestamp: number;
  language: 'en' | 'sl';
}

let eventsCache: EventCache | null = null;
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function getCurrentLanguage(): 'en' | 'sl' {
  if (!isClient) return 'en';
  return cachedLanguage;
}

// Function to set language externally
export function setTranslationLanguage(language: 'en' | 'sl'): void {
  cachedLanguage = language;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  type: 'workshop' | 'lecture' | 'community' | 'other';
  url?: string;
}

// Use our API proxy to avoid CORS issues
const CALENDAR_URL = '/api/calendar';

/**
 * Determines the event type based on the event summary/description
 */
function determineEventType(summary: string, description: string): 'workshop' | 'lecture' | 'community' | 'other' {
  const text = (summary + ' ' + description).toLowerCase();
  
  if (text.includes('workshop') || text.includes('delavnica')) {
    return 'workshop';
  } else if (text.includes('lecture') || text.includes('talk') || text.includes('predavanje')) {
    return 'lecture';
  } else if (text.includes('community') || text.includes('skupnost')) {
    return 'community';
  } else {
    return 'other';
  }
}

/**
 * Fetches events from Google Calendar
 */
// Simple function to parse iCal data
function parseICalData(icsData: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icsData.split('\n');
  
  let currentEvent: Partial<CalendarEvent> | null = null;
  let eventIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'BEGIN:VEVENT') {
      currentEvent = { id: `event-${eventIndex++}` };
    } else if (line === 'END:VEVENT' && currentEvent) {
      if (currentEvent.title && currentEvent.start) {
        events.push({
          id: currentEvent.id || `event-${eventIndex}`,
          title: currentEvent.title,
          description: currentEvent.description || '',
          start: currentEvent.start,
          end: currentEvent.end || new Date(currentEvent.start.getTime() + 3600000), // Default 1 hour
          location: currentEvent.location || 'Livada Biotope',
          type: determineEventType(currentEvent.title, currentEvent.description || ''),
          url: currentEvent.url
        } as CalendarEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      // Handle line continuations (lines that start with a space)
      let fullLine = line;
      while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
        fullLine += lines[i + 1].substring(1);
        i++;
      }
      
      if (fullLine.startsWith('SUMMARY:')) {
        currentEvent.title = fullLine.substring(8)
          .replace(/\\,/g, ',')
          .replace(/\\n/g, ' ')
          .replace(/\\;/g, ';');
      } else if (fullLine.startsWith('DESCRIPTION:')) {
        currentEvent.description = fullLine.substring(12)
          .replace(/\\n/g, '\n')
          .replace(/\\,/g, ',')
          .replace(/\\;/g, ';')
          .replace(/\\\\n/g, '\n'); // Handle double escaped newlines
      } else if (fullLine.startsWith('LOCATION:')) {
        currentEvent.location = fullLine.substring(9).replace(/\\,/g, ',');
      } else if (fullLine.startsWith('DTSTART')) {
        // Handle both DTSTART: and DTSTART;TZID=...: formats
        const colonIndex = fullLine.indexOf(':');
        if (colonIndex > 0) {
          currentEvent.start = parseICalDate(fullLine.substring(colonIndex + 1), fullLine);
        }
      } else if (fullLine.startsWith('DTEND')) {
        // Handle both DTEND: and DTEND;TZID=...: formats
        const colonIndex = fullLine.indexOf(':');
        if (colonIndex > 0) {
          currentEvent.end = parseICalDate(fullLine.substring(colonIndex + 1), fullLine);
        }
      } else if (fullLine.startsWith('URL:')) {
        currentEvent.url = fullLine.substring(4);
      } else if (fullLine.startsWith('UID:')) {
        currentEvent.id = fullLine.substring(4);
      }
    }
  }
  
  // Sort events by start date
  events.sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Log the number of events found for debugging
  if (isClient && events.length > 0) {
    console.log(`Parsed ${events.length} events from calendar`);
    console.log(`First event: ${events[0].title} on ${events[0].start.toLocaleDateString()}`);
  }
  
  return events;
}

// Parse iCal date format
function parseICalDate(dateStr: string, fullLine?: string): Date {
  // Check for timezone information
  const hasTzid = fullLine && fullLine.includes('TZID=');
  let tzid = '';
  
  if (hasTzid && fullLine) {
    // Extract timezone ID if present
    const tzidMatch = fullLine.match(/TZID=([^:]+)/);
    if (tzidMatch && tzidMatch[1]) {
      tzid = tzidMatch[1];
    }
  }
  
  // Basic format: YYYYMMDDTHHMMSSZ
  if (dateStr.includes('T')) {
    // Handle date with time
    let datePart, timePart;
    
    if (dateStr.includes('Z')) {
      // UTC time format: 20250512T123000Z
      datePart = dateStr.substring(0, 8);
      timePart = dateStr.substring(9, 15);
      
      const year = parseInt(datePart.substring(0, 4));
      const month = parseInt(datePart.substring(4, 6)) - 1; // JS months are 0-indexed
      const day = parseInt(datePart.substring(6, 8));
      
      const hour = parseInt(timePart.substring(0, 2));
      const minute = parseInt(timePart.substring(2, 4));
      const second = parseInt(timePart.substring(4, 6));
      
      // Create date in local time by adjusting for timezone offset
      const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
      
      if (isClient) {
        console.log(`Parsed UTC date: ${utcDate.toISOString()} from ${dateStr}`);
      }
      
      return utcDate;
    } else {
      // Local time format: 20250512T123000
      datePart = dateStr.substring(0, 8);
      timePart = dateStr.substring(9);
      
      const year = parseInt(datePart.substring(0, 4));
      const month = parseInt(datePart.substring(4, 6)) - 1;
      const day = parseInt(datePart.substring(6, 8));
      
      let hour = 0, minute = 0, second = 0;
      if (timePart.length >= 2) hour = parseInt(timePart.substring(0, 2));
      if (timePart.length >= 4) minute = parseInt(timePart.substring(2, 4));
      if (timePart.length >= 6) second = parseInt(timePart.substring(4, 6));
      
      // Create a date object in local time
      const localDate = new Date(year, month, day, hour, minute, second);
      
      if (isClient) {
        console.log(`Parsed local date: ${localDate.toISOString()} from ${dateStr}`);
      }
      
      return localDate;
    }
  } else {
    // All-day event format: YYYYMMDD
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    
    // Create date at midnight in local timezone
    const localDate = new Date(year, month, day, 0, 0, 0);
    
    return localDate;
  }
}

/**
 * Fetches calendar events from the Google Calendar with caching
 */
export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  // Return empty array if running on server
  if (!isClient) {
    return [];
  }
  
  const currentLanguage = getCurrentLanguage();
  const now = Date.now();
  
  // Check if we have a valid cache
  if (eventsCache && 
      eventsCache.language === currentLanguage && 
      now - eventsCache.timestamp < CACHE_EXPIRY_MS) {
    // Use cached events if they're still valid
    return eventsCache.events;
  }
  
  try {
    // Use the API endpoint to avoid CORS issues
    const apiUrl = `/api/calendar?_=${now}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`);
    }
    
    const icsData = await response.text();
    const events = parseICalData(icsData);
    
    // If language is Slovenian, translate event content
    let processedEvents = events;
    if (currentLanguage === 'sl') {
      processedEvents = translateEvents(events);
    }
    
    // Cache the processed events
    eventsCache = {
      events: processedEvents,
      timestamp: now,
      language: currentLanguage
    };
    
    return processedEvents;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

/**
 * Formats a date to a string in the format YYYY-MM-DD
 */
export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gets events for a specific date
 */
export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  // Create a date object for the selected date with time set to midnight
  const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  return events.filter(event => {
    // Create a date object for the event date with time set to midnight
    const eventDate = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
    
    // Compare the dates (ignoring time)
    return eventDate.getTime() === selectedDate.getTime();
  });
}

/**
 * Checks if a date has any events
 */
export function dateHasEvents(events: CalendarEvent[], date: Date): boolean {
  // Create a date object for the selected date with time set to midnight
  const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Check if any events fall on this date
  return events.some(event => {
    const eventDate = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
    return eventDate.getTime() === selectedDate.getTime();
  });
}

/**
 * Gets upcoming events (from today onwards)
 */
/**
 * Translate events from English to Slovenian
 */
export function translateEvents(events: CalendarEvent[]): CalendarEvent[] {
  // Create a deep copy of events to avoid reference issues
  return events.map(event => {
    // Create a new event object with translated properties
    const translatedTitle = translateEventTitle(event.title);
    const translatedDescription = translateEventDescription(event.description);
    const translatedLocation = translateEventLocation(event.location);
    
    // Return a completely new object to ensure React detects the change
    return {
      ...event,
      id: event.id,
      title: translatedTitle,
      description: translatedDescription,
      location: translatedLocation,
      start: new Date(event.start),
      end: new Date(event.end),
      url: event.url,
      type: event.type
    };
  });
}

export function getUpcomingEvents(events: CalendarEvent[], limit: number = 3): CalendarEvent[] {
  // Get current date without time
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Log for debugging
  if (isClient && events.length > 0) {
    console.log(`Finding upcoming events. Total events: ${events.length}`);
    console.log(`Current date: ${today.toISOString()}`);
  }
  
  const upcomingEvents = events
    .filter(event => {
      // For all-day events, compare just the date part
      const eventDate = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
      const isUpcoming = eventDate >= today;
      
      if (isClient && isUpcoming) {
        console.log(`Upcoming event: ${event.title} on ${event.start.toLocaleDateString()}`);
      }
      
      return isUpcoming;
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, limit);
  
  if (isClient) {
    console.log(`Found ${upcomingEvents.length} upcoming events`);
  }
  
  return upcomingEvents;
}
