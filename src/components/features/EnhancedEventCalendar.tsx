'use client';

import * as React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { enUS, sl } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const dateFnsLocales = { en: enUS, sl } as const;

export interface CalendarEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  allDay?: boolean;
  type?: string;
  url?: string;
  extendedProps?: Record<string, unknown>;
  resource?: any;
}

export interface EnhancedEventCalendarProps {
  locale?: 'en' | 'sl';
  showUpcomingEvents?: boolean;
  maxUpcomingEvents?: number;
  events?: CalendarEvent[];
  loading?: boolean;
  error?: string | null;
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void;
  onNavigate?: (date: Date) => void;
  onView?: (view: string) => void;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-US': enUS, sl },
});

const EnhancedEventCalendar: React.FC<EnhancedEventCalendarProps> = ({
  locale: propLocale,
  showUpcomingEvents = true,
  maxUpcomingEvents = 5,
  events = [],
  loading = false,
  error = null,
  onSelectEvent,
  onSelectSlot,
  onNavigate,
  onView,
}) => {
  const { locale: contextLocale } = useLanguage();
  const locale = (propLocale || contextLocale || 'en') as 'en' | 'sl';
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  
  // Get events for the current date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => isSameDay(event.start, date));
  };

  // Get upcoming events
  const upcomingEvents = React.useMemo(() => {
    const now = new Date();
    return events
      .filter(event => event.start >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, maxUpcomingEvents);
  }, [events, maxUpcomingEvents]);

  const selectedDateEvents = getEventsForDate(currentDate);

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    if (onNavigate) onNavigate(newDate);
  };

  const handleView = (view: string) => {
    if (onView) onView(view);
  };

  const messages = {
    next: locale === 'en' ? 'Next' : 'Naprej',
    previous: locale === 'en' ? 'Back' : 'Nazaj',
    today: locale === 'en' ? 'Today' : 'Danes',
    month: locale === 'en' ? 'Month' : 'Mesec',
    week: locale === 'en' ? 'Week' : 'Teden',
    day: locale === 'en' ? 'Day' : 'Dan',
    agenda: locale === 'en' ? 'Agenda' : 'Dnevni red',
    date: locale === 'en' ? 'Date' : 'Datum',
    time: locale === 'en' ? 'Time' : 'Čas',
    event: locale === 'en' ? 'Event' : 'Dogodek',
    noEventsInRange: locale === 'en' 
      ? 'No events in this range.' 
      : 'V tem obdobju ni dogodkov.',
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {format(currentDate, 'MMMM yyyy', { locale: dateFnsLocales[locale] })}
        </Typography>
        
        <div style={{ height: 500 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            culture={locale}
            messages={messages}
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
            onNavigate={handleNavigate}
            onView={handleView}
            selectable={!!onSelectSlot}
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            step={60}
            timeslots={1}
            defaultDate={new Date()}
            toolbar={true}
          />
        </div>

        {selectedDateEvents.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              {locale === 'en' 
                ? `Events on ${format(currentDate, 'PP', { locale: dateFnsLocales[locale] })}`
                : `Dogodki ${format(currentDate, 'PP', { locale: dateFnsLocales[locale] })}`}
            </Typography>
            <List>
              {selectedDateEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem 
                    alignItems="flex-start"
                    button={!!onSelectEvent as any}
                    onClick={() => onSelectEvent?.(event)}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {format(event.start, 'PPp', { locale: dateFnsLocales[locale] })}
                            {event.end && ` - ${format(event.end, 'p', { locale: dateFnsLocales[locale] })}`}
                          </Typography>
                          {event.location && (
                            <Typography component="div" variant="body2" color="text.secondary">
                              {event.location}
                            </Typography>
                          )}
                          {event.description && (
                            <Typography component="div" variant="body2" color="text.secondary">
                              {event.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < selectedDateEvents.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {showUpcomingEvents && upcomingEvents.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {locale === 'en' ? 'Upcoming Events' : 'Prihajajoči dogodki'}
          </Typography>
          <List>
            {upcomingEvents.map((event, index) => (
              <React.Fragment key={event.id}>
                <ListItem 
                  alignItems="flex-start"
                  button={!!onSelectEvent as any}
                  onClick={() => onSelectEvent?.(event)}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {format(event.start, 'PPp', { locale: dateFnsLocales[locale] })}
                          {event.end && ` - ${format(event.end, 'p', { locale: dateFnsLocales[locale] })}`}
                        </Typography>
                        {event.location && (
                          <Typography component="div" variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        )}
                        {event.description && (
                          <Typography component="div" variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < upcomingEvents.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default EnhancedEventCalendar;
