'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Box, Typography, CircularProgress } from '@mui/material';

// Import the EnhancedEventCalendar component with SSR disabled
const EnhancedEventCalendar = dynamic(
  () => import('@/components/features/EnhancedEventCalendar'),
  { ssr: false, loading: () => <CircularProgress /> }
);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
  description?: string;
  location?: string;
  url?: string;
}

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/calendar');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        // Transform the events to match the CalendarEvent type
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : new Date(event.start),
          allDay: event.allDay || false,
          description: event.description,
          location: event.location,
          url: event.url,
        }));
        
        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(t('errorLoadingEvents'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [t]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ height: '70vh' }}>
          <EnhancedEventCalendar events={events} />
        </Box>
      )}
    </Box>
  );
}
