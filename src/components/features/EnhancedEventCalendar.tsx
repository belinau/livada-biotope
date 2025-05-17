import React, { useState, useEffect } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import { Box, Typography, Paper, CircularProgress, Alert, Divider } from '@mui/material';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';
import { fetchCalendarEvents, getEventsForDate, getUpcomingEvents } from '@/lib/calendarService';

type CalendarValue = Date | null | [Date | null, Date | null];

interface EnhancedEventCalendarProps {
  events?: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectDate?: (date: Date) => void;
  initialDate?: Date;
  locale?: string;
}

export default function EnhancedEventCalendar({
  events: initialEvents = [],
  onSelectEvent,
  onSelectDate,
  initialDate = new Date(),
  locale = 'en'
}: EnhancedEventCalendarProps) {
  const [date, setDate] = useState<Date>(initialDate);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [loading, setLoading] = useState<boolean>(!initialEvents.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      if (initialEvents.length) return;
      
      try {
        setLoading(true);
        const fetchedEvents = await fetchCalendarEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [initialEvents.length]);

  const handleDateChange = (value: CalendarValue) => {
    if (value === null) return;
    
    const newDate = Array.isArray(value) ? value[0] : value;
    if (newDate) {
      setDate(newDate);
      onSelectDate?.(newDate);
      setSelectedEvent(null);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onSelectEvent?.(event);
  };

  const selectedDateEvents = getEventsForDate(date, events);
  const upcomingEvents = getUpcomingEvents(events, 3);

  const formatDate = (date: Date): string => {
    return format(date, 'EEEE, MMMM d, yyyy', { locale: locale === 'sl' ? sl : undefined });
  };

  const formatTime = (date: Date | string): string => {
    return format(new Date(date), 'HH:mm');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }


  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
      <Box flex={1}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <ReactCalendar
            onChange={handleDateChange}
            value={date}
            locale={locale}
            tileContent={({ date, view }) =>
              view === 'month' && getEventsForDate(date, events).length > 0 ? (
                <div style={{ height: '4px', width: '4px', backgroundColor: 'red', borderRadius: '50%', margin: '0 auto' }} />
              ) : null
            }
          />
        </Paper>


        {selectedDateEvents.length > 0 && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {formatDate(date)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {selectedDateEvents.map((event) => (
              <Box
                key={event.id}
                onClick={() => handleEventClick(event)}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  bgcolor: selectedEvent?.id === event.id ? 'action.selected' : 'background.paper',
                }}
              >
                <Typography variant="subtitle1">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(event.start)}
                  {event.end && ` - ${formatTime(event.end)}`}
                </Typography>
                {event.location && (
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      <Box width={{ xs: '100%', md: 300 }}>
        <Paper elevation={3} sx={{ p: 2, position: 'sticky', top: 20 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Events
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Box 
                key={event.id} 
                sx={{ 
                  mb: 2, 
                  pb: 2, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  p: 1,
                  borderRadius: 1
                }}
                onClick={() => {
                  setDate(new Date(event.start));
                  handleEventClick(event);
                }}
              >
                <Typography variant="subtitle2">{event.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(new Date(event.start))}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No upcoming events
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
