import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import { Box, Typography, Paper, Grid, Chip, CircularProgress } from '@mui/material';
import { 
  fetchCalendarEvents, 
  getEventsForDate, 
  dateHasEvents, 
  getUpcomingEvents,
  CalendarEvent 
} from '@/lib/calendarService';
import 'react-calendar/dist/Calendar.css';

// Import Calendar dynamically to avoid SSR hydration issues
const Calendar = dynamic(
  () => import('react-calendar'),
  { ssr: false } // This ensures the component only renders client-side
);

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const EventCalendar: React.FC = () => {
  // Check if we're on the client side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { language } = useLanguage();
  // Use null as initial state to avoid hydration mismatch
  const [date, setDate] = useState<Value>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch calendar events and set the date on the client side only
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await fetchCalendarEvents();
        setAllEvents(events);
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
        console.log(`Found events for date: ${localDate.toDateString()}`);
      }

      // Use a simple text character instead of an SVG or div element
      return hasEvents ? (
        <span style={{ fontSize: '0.75rem', color: '#2e7d32', textAlign: 'center', margin: '0 auto' }}>•</span>
      ) : null;
    }
    return null;
  };

  // Format date for display
  const formatEventDate = (date: Date): string => {
    return date.toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              style={{ textDecoration: 'none' }}
            >
              <Chip 
                label={language === 'en' ? 'Download iCal File' : 'Prenos iCal datoteke'} 
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
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ ml: 2 }}>
            {language === 'en' ? 'Loading events...' : 'Nalaganje dogodkov...'}
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">{error}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {language === 'en' 
              ? 'Please try again later or contact the administrator.' 
              : 'Poskusite znova kasneje ali kontaktirajte administratorja.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              '& .react-calendar': { 
                width: '100%', 
                border: '1px solid #e0e0e0', 
                borderRadius: 2,
                fontFamily: 'inherit',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              },
              '& .react-calendar__tile--active': {
                background: '#2e7d32',
                color: 'white'
              },
              '& .react-calendar__tile--active:enabled:hover': {
                background: '#1b5e20'
              },
              '& .react-calendar__tile--now': {
                background: '#e8f5e9',
                color: '#2e7d32'
              }
            }}>
              <Calendar 
                onChange={handleDateChange} 
                value={date} 
                tileContent={tileContent}
                showNeighboringMonth={false}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              {selectedEvents.length > 0 
                ? `${language === 'en' ? 'Events on' : 'Dogodki na'} ${date instanceof Date ? date.toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US') : ''}` 
                : language === 'en' ? 'Select a date to view events' : 'Izberite datum za ogled dogodkov'}
            </Typography>
            
            {/* Machine translation notice - only show in Slovenian */}
            {language === 'sl' && selectedEvents.length > 0 && (
              <Box sx={{ 
                mb: 2, 
                p: 1, 
                bgcolor: 'info.light', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="caption" sx={{ color: 'info.dark', fontStyle: 'italic' }}>
                  Opomba: Opisi dogodkov so strojno prevedeni iz angleščine.
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedEvents.length > 0 ? (
                selectedEvents.map(event => {
                  const isPastEvent = event.start < new Date();
                  
                  return (
                    <Paper 
                      key={event.id} 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        borderLeft: '4px solid',
                        borderColor: event.type === 'workshop' ? 'info.main' : 
                                    event.type === 'lecture' ? 'warning.main' : 
                                    event.type === 'community' ? 'success.main' : 'grey.500',
                        bgcolor: isPastEvent ? 'rgba(0,0,0,0.03)' : 'background.paper',
                        borderRadius: '0 4px 4px 0'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle1" fontWeight="medium" color={isPastEvent ? 'text.secondary' : 'text.primary'}>
                          {event.title}
                          {isPastEvent && (
                            <Chip 
                              label={language === 'en' ? 'Past' : 'Pretekli'} 
                              size="small" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, color: isPastEvent ? 'text.secondary' : 'text.primary' }}>
                        {event.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>{language === 'en' ? 'Location' : 'Lokacija'}:</strong> {event.location}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          <strong>{language === 'en' ? 'Type' : 'Tip'}:</strong> {
                            event.type === 'workshop' ? (language === 'en' ? 'Workshop' : 'Delavnica') :
                            event.type === 'lecture' ? (language === 'en' ? 'Lecture' : 'Predavanje') :
                            event.type === 'community' ? (language === 'en' ? 'Community Event' : 'Skupnostni dogodek') :
                            (language === 'en' ? 'Other' : 'Drugo')
                          }
                        </Typography>
                      </Box>
                      
                      {event.url && (
                        <Box sx={{ mt: 2 }}>
                          <a 
                            href={event.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                          >
                            <Chip 
                              label={language === 'en' ? 'Event Details' : 'Podrobnosti dogodka'} 
                              size="small"
                              color="primary"
                              variant="outlined"
                              clickable
                            />
                          </a>
                        </Box>
                      )}
                    </Paper>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {language === 'en' ? 'No events scheduled for this date.' : 'Za ta datum ni načrtovanih dogodkov.'}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
