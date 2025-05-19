import { CalendarEvent } from '@/types/calendar';

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetches calendar events from the API
 */
export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const icalData = await response.text();
    // Parse the iCal data and convert to CalendarEvent[]
    return parseICalData(icalData);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

/**
 * Parses iCal data and converts it to CalendarEvent[]
 */
function parseICalData(icalData: string): CalendarEvent[] {
  // Simple iCal parser - this is a basic implementation
  // You might want to use a library like 'ical.js' for more robust parsing
  const events: CalendarEvent[] = [];
  const lines = icalData.split('\n');
  let currentEvent: Partial<CalendarEvent> = {};
  let inEvent = false;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {};
      inEvent = true;
      continue;
    }

    if (line.startsWith('END:VEVENT')) {
      if (currentEvent.start && currentEvent.title) {
        // Ensure required fields are present
        events.push({
          id: currentEvent.id || '',
          title: currentEvent.title,
          start: currentEvent.start,
          end: currentEvent.end || currentEvent.start, // Use start as fallback for end
          description: currentEvent.description,
          location: currentEvent.location,
          allDay: currentEvent.allDay || false,
        } as CalendarEvent);
      }
      inEvent = false;
      continue;
    }

    if (!inEvent) continue;

    // Parse event properties
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':');

    if (key.includes('DTSTART')) {
      currentEvent.start = parseICalDate(value);
      currentEvent.allDay = key.includes('VALUE=DATE');
    } else if (key.includes('DTEND')) {
      currentEvent.end = parseICalDate(value);
    } else if (key === 'SUMMARY') {
      currentEvent.title = value;
    } else if (key === 'DESCRIPTION') {
      currentEvent.description = value;
    } else if (key === 'LOCATION') {
      currentEvent.location = value;
    } else if (key === 'UID') {
      currentEvent.id = value;
    }
  }

  return events;
}

/**
 * Parses an iCal date string into a Date object
 */
function parseICalDate(dateStr: string): Date {
  // Basic iCal date parsing
  // Format: YYYYMMDDTHHmmss or YYYYMMDD for all-day events
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-based
  const day = parseInt(dateStr.substring(6, 8));
  
  if (dateStr.includes('T')) {
    // Has time component
    const hours = parseInt(dateStr.substring(9, 11));
    const minutes = parseInt(dateStr.substring(11, 13));
    return new Date(Date.UTC(year, month, day, hours, minutes));
  }
  
  // All-day event
  return new Date(year, month, day);
}

/**
 * Gets events for a specific date
 */
export function getEventsForDate(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  if (!date) return [];
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(targetDate);
  nextDay.setDate(targetDate.getDate() + 1);
  
  return events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate >= targetDate && eventDate < nextDay;
  });
}

/**
 * Checks if a date has any events
 */
export function dateHasEvents(date: Date, events: CalendarEvent[]): boolean {
  if (!date) return false;
  return getEventsForDate(date, events).length > 0;
}

/**
 * Gets upcoming events
 * @param limit Maximum number of events to return
 */
export function getUpcomingEvents(events: CalendarEvent[], limit: number = 3): CalendarEvent[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.start) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, limit);
}

// Export the CalendarEvent type for use in other files
export type { CalendarEvent } from '@/types/calendar';
