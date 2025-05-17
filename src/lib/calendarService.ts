import { CalendarEvent } from '@/types/calendar';

// Mock data for development
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Garden Workshop',
    start: new Date(2023, 5, 15, 10, 0),
    end: new Date(2023, 5, 15, 12, 0),
    description: 'Learn about permaculture and sustainable gardening practices.',
    location: 'Livada Biotope, Ljubljana',
  },
  {
    id: '2',
    title: 'Community Meeting',
    start: new Date(2023, 5, 17, 18, 0),
    end: new Date(2023, 5, 17, 20, 0),
    description: 'Monthly community gathering to discuss ongoing projects.',
    location: 'Community Center',
  },
  {
    id: '3',
    title: 'Sustainability Workshop',
    start: new Date(2023, 5, 20, 14, 0),
    end: new Date(2023, 5, 20, 16, 0),
    description: 'Workshop on sustainable living practices.',
    location: 'Main Garden',
  },
];

/**
 * Fetches calendar events from the API
 */
export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEvents]);
    }, 500);
  });
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
