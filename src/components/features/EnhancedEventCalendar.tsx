import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';

import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  CircularProgress, 
  Card, 
  CardContent,
  CardActions,
  Button,
  Divider,
  Alert
} from '@mui/material';

import Grid from '@/components/ui/Grid'; 

import { 
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

import { fetchCalendarEvents, getEventsForDate, dateHasEvents, getUpcomingEvents, CalendarEvent } from '@/lib/calendarService';
import 'react-calendar/dist/Calendar.css';

// Import Calendar dynamically to avoid SSR hydration issues
const Calendar = dynamic(
  () => import('react-calendar'),
  { ssr: false } // This ensures the component only renders client-side
);

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const EnhancedEventCalendar: React.FC = () => {
  // Check if we're on the client side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { language } = useLanguage();
  const { t } = useTranslations();
  
  // Use null as initial state to avoid hydration mismatch
  const [date, setDate] = useState<Value>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch calendar events and set the date on the client side only
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await fetchCalendarEvents();
        setAllEvents(events);
        
        // Set upcoming events
        const upcoming = getUpcomingEvents(events, 3);
        setUpcomingEvents(upcoming);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(language === 'en' ? 'Failed to load events' : 'Napaka pri nalaganju dogodkov');
        setLoading(false);
      }
    };
    
    setDate(new Date());
    fetchEvents();
  }, [language]);

  const handleDateChange = (value: Value) => {
    setDate(value);
    
    if (value instanceof Date) {
      // Create a new date object to avoid timezone issues
      const localDate = new Date(value.getFullYear(), value.getMonth(), value.getDate());
      console.log(`Selected date: ${localDate.toDateString()}`);
      
      const selected = getEventsForDate(allEvents, localDate);
      console.log(`Found ${selected.length} events for selected date`);
      
      setSelectedEvents(selected);
    } else {
      setSelectedEvents([]);
    }
  };

  // Function to check if a date has events
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      // Create a new date object to avoid timezone issues
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const hasEvents = dateHasEvents(allEvents, localDate);
      
      if (hasEvents && isClient) {
        return (
          <div 
            style={{ 
              position: 'absolute',
              bottom: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#2e7d32'
            }}
          />
        );
      }
    }
    return null;
  };

  // Format date for display
  const formatEventDate = (date: Date): string => {
    return date.toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatEventTime = (date: Date): string => {
    return date.toLocaleTimeString(language === 'sl' ? 'sl-SI' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get event type label
  const getEventTypeLabel = (type: string): string => {
    switch (type) {
      case 'workshop':
        return language === 'en' ? 'Workshop' : 'Delavnica';
      case 'lecture':
        return language === 'en' ? 'Lecture' : 'Predavanje';
      case 'community':
        return language === 'en' ? 'Community Event' : 'Skupnostni dogodek';
      default:
        return language === 'en' ? 'Event' : 'Dogodek';
    }
  };

  // Get chip color based on event type
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'workshop':
        return '#4caf50'; // green
      case 'lecture':
        return '#2196f3'; // blue
      case 'community':
        return '#ff9800'; // orange
      default:
        return '#9e9e9e'; // grey
    }
  };

  // Only render the full calendar on the client side
  if (!isClient) {
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ ml: 2 }}>
            {language === 'en' ? 'Loading calendar...' : 'Nalaganje koledarja...'}
          </Typography>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
      
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            {language === 'en' ? 'Subscribe to Our Calendar' : 'Naročite se na naš koledar'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {language === 'en' 
              ? 'Stay updated with all our events by adding our calendar to your preferred calendar app.' 
              : 'Ostanite na tekočem z vsemi našimi dogodki tako, da dodate naš koledar v svojo priljubljeno aplikacijo za koledar.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <a 
              href="https://calendar.google.com/calendar/embed?src=c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com&ctz=Europe%2FLjubljana&showPast=1" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Chip 
                label={language === 'en' ? 'View in Google Calendar' : 'Ogled v Google Koledarju'} 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.dark',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }} 
                clickable 
              />
            </a>
            <a 
              href="https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Chip 
                label={language === 'en' ? 'iCal Format (Apple, Outlook)' : 'iCal Format (Apple, Outlook)'} 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.dark',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }} 
                clickable 
              />
            </a>
          </Box>
        </Box>
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1 }} />
            {language === 'en' ? 'Event Calendar' : 'Koledar dogodkov'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ 
              '.react-calendar': { 
                width: '100%', 
                border: 'none', 
                fontFamily: 'inherit',
                boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '16px'
              },
              '.react-calendar__tile': { 
                position: 'relative',
                height: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '8px 0'
              },
              '.react-calendar__month-view__days__day--weekend': {
                color: '#d32f2f'
              },
              '.react-calendar__tile--now': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)'
              },
              '.react-calendar__tile--active': {
                backgroundColor: 'rgba(46, 125, 50, 0.2)'
              },
              '.react-calendar__tile--active:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.3)'
              },
              '.react-calendar__tile:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)'
              },
              '.react-calendar__navigation button:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)'
              },
              '.react-calendar__navigation button:focus': {
                backgroundColor: 'rgba(46, 125, 50, 0.2)'
              }
            }}>
              <Calendar 
                onChange={handleDateChange} 
                value={date} 
                tileContent={tileContent}
                locale={language === 'sl' ? 'sl-SI' : 'en-US'}
              />
            </Box>
          )}
          
          {selectedEvents.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'en' ? 'Events on ' : 'Dogodki na '} 
                {date instanceof Date && formatEventDate(date)}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {selectedEvents.map((event) => (
                  <Card key={event.id} sx={{ mb: 2, boxShadow: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {event.title}
                        </Typography>
                        <Chip 
                          label={getEventTypeLabel(event.type)} 
                          size="small" 
                          sx={{ 
                            bgcolor: getEventTypeColor(event.type),
                            color: 'white'
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatEventTime(event.start)} - {formatEventTime(event.end)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                      
                      {event.description && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {event.description}
                        </Typography>
                      )}
                    </CardContent>
                    
                    {event.url && (
                      <CardActions>
                        <Button 
                          size="small" 
                          href={event.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ color: 'primary.main' }}
                        >
                          {language === 'en' ? 'More Info' : 'Več informacij'}
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            {language === 'en' ? 'Upcoming Events' : 'Prihajajoči dogodki'}
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : upcomingEvents.length > 0 ? (
            <Box>
              {upcomingEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {event.title}
                      </Typography>
                      <Chip 
                        label={getEventTypeLabel(event.type)} 
                        size="small" 
                        sx={{ 
                          bgcolor: getEventTypeColor(event.type),
                          color: 'white',
                          fontSize: '0.7rem',
                          height: '24px'
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {formatEventDate(event.start)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '0.9rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatEventTime(event.start)} - {formatEventTime(event.end)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '0.9rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                    
                    {event.url && (
                      <Box sx={{ mt: 1 }}>
                        <Button 
                          size="small" 
                          href={event.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: 'primary.main', 
                            p: 0,
                            fontSize: '0.8rem',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {language === 'en' ? 'More Info' : 'Več informacij'}
                        </Button>
                      </Box>
                    )}
                  </Paper>
                  {index < upcomingEvents.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {language === 'en' 
                  ? 'No upcoming events at the moment.' 
                  : 'Trenutno ni prihajajočih dogodkov.'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {language === 'en' 
                  ? 'Check back soon or subscribe to our calendar.' 
                  : 'Preverite kmalu ali se naročite na naš koledar.'}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
