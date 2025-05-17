export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  description?: string;
  location?: string;
  allDay?: boolean;
  type?: string;
  url?: string;
}
