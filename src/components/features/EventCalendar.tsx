'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { format, parseISO, isSameDay, isToday, isSameMonth, addMonths } from 'date-fns';
import { enUS, sl } from 'date-fns/locale';
import { useCallback, useEffect, useState } from 'react';

const dateFnsLocales = { en: enUS, sl } as const;

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  description?: string;
  location?: string;
  allDay?: boolean;
  type?: string;
  url?: string;
  extendedProps?: Record<string, unknown>;
  resource?: any;
}

export default function EventCalendar() {
  const { locale: contextLocale } = useLanguage();
  const locale = contextLocale || 'en';
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data fetch - replace with your actual data fetching logic
  const fetchEvents = useCallback(async () => {
    try {
      // Replace with your actual API call
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Sample Event',
          start: new Date(),
          description: 'This is a sample event',
        },
      ];
      setEvents(mockEvents);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, -1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      return isSameDay(eventDate, date);
    });
  }, [events]);

  const getUpcomingEvents = useCallback((count: number): CalendarEvent[] => {
    const now = new Date();
    return events
      .filter(event => {
        const eventDate = typeof event.start === 'string' ? parseISO(event.start) : event.start;
        return eventDate >= now;
      })
      .sort((a, b) => {
        const dateA = typeof a.start === 'string' ? parseISO(a.start) : a.start;
        const dateB = typeof b.start === 'string' ? parseISO(b.start) : b.start;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, count);
  }, [events]);

  const selectedDateEvents = getEventsForDate(currentDate);
  const upcomingEvents = getUpcomingEvents(3);

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
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {format(currentDate, 'MMMM yyyy', { locale: dateFnsLocales[locale as keyof typeof dateFnsLocales] })}
          </Typography>
          <Box>
            <button onClick={handlePrevMonth}>&lt;</button>
            <button onClick={handleNextMonth}>&gt;</button>
          </Box>
        </Box>
        
        {/* Calendar grid would go here */}
        
        {selectedDateEvents.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Events on {format(currentDate, 'PP', { locale: dateFnsLocales[locale as keyof typeof dateFnsLocales] })}
            </Typography>
            {selectedDateEvents.map((event) => (
              <Box key={event.id} mb={2}>
                <Typography fontWeight="bold">{event.title}</Typography>
                {event.description && (
                  <Typography variant="body2" color="text.secondary">
                    {event.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upcoming Events
        </Typography>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => {
            const eventDate = typeof event.start === 'string' ? parseISO(event.start) : event.start;
            return (
              <Box key={event.id} mb={2}>
                <Typography fontWeight="bold">
                  {format(eventDate, 'PP', { locale: dateFnsLocales[locale as keyof typeof dateFnsLocales] })}
                </Typography>
                <Typography>{event.title}</Typography>
              </Box>
            );
          })
        ) : (
          <Typography color="text.secondary">No upcoming events</Typography>
        )}
      </Paper>
    </Box>
  );
}
