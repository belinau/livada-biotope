import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarEvent } from '@/types/calendar';
import { 
  fetchCalendarEvents, 
  getEventsForDate as getEventsForDateUtil, 
  dateHasEvents as dateHasEventsUtil, 
  getUpcomingEvents as getUpcomingEventsUtil
} from '@/lib/calendarService';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Local type-safe wrappers for the utility functions
const getEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
  return getEventsForDateUtil(date, events);
};

const dateHasEvents = (date: Date, events: CalendarEvent[]): boolean => {
  return dateHasEventsUtil(date, events);
};

const getUpcomingEvents = (events: CalendarEvent[], count: number): CalendarEvent[] => {
  return getUpcomingEventsUtil(events, count);
};

export const EventCalendar: React.FC = () => {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await fetchCalendarEvents();
        // Ensure all events have a defined end date
        const processedEvents = fetchedEvents.map(event => ({
          ...event,
          end: event.end || event.start
        }));
        setEvents(processedEvents);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleDateChange = (value: Value) => {
    if (value === null) return;
    
    const newDate = Array.isArray(value) ? value[0] : value;
    if (newDate) {
      setDate(newDate);
    }
  };

  const selectedDateEvents = getEventsForDate(date, events);
  const upcomingEvents = getUpcomingEvents(events, 3);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
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
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <ReactCalendar
          onChange={handleDateChange}
          value={date}
          locale={language}
          tileContent={({ date, view }) =>
            view === 'month' && dateHasEvents(date, events) ? (
              <div style={{ height: '4px', width: '4px', backgroundColor: 'red', borderRadius: '50%', margin: '0 auto' }} />
            ) : null
          }
        />
      </Paper>


      {selectedDateEvents.length > 0 && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Events on {date.toLocaleDateString()}
          </Typography>
          {selectedDateEvents.map((event) => (
            <Box key={event.id} p={2} mb={1} bgcolor="background.paper" borderRadius={1}>
              <Typography variant="subtitle1">{event.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(event.start).toLocaleTimeString()} - {event.end ? new Date(event.end).toLocaleTimeString() : ''}
              </Typography>
              {event.location && (
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
              )}
              {event.description && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {event.description}
                </Typography>
              )}
            </Box>
          ))}
        </Paper>
      )}

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upcoming Events
        </Typography>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <Box key={event.id} p={2} mb={1} bgcolor="background.paper" borderRadius={1}>
              <Typography variant="subtitle2">{event.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(event.start).toLocaleString()}
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
  );
};

export default EventCalendar;
