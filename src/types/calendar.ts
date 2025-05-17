// This type should match @livada-ignite/types/calendar
// We're making end required and non-optional to match the expected type
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;  // Made required
  description?: string;
  location?: string;
  allDay?: boolean;
  type?: string;
  url?: string;
  extendedProps?: {
    [key: string]: any;
  };
  resource?: any;
}

// For backward compatibility
export type { CalendarEvent as CalendarEventType };
export default CalendarEvent;
