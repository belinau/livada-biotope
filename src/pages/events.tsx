import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { EventCalendar } from '@/components/features/EventCalendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchCalendarEvents, getUpcomingEvents, CalendarEvent, setTranslationLanguage } from '@/lib/calendarService';
import { TranslatedEvent } from '@/components/features/TranslatedEvent';
import SharedLayout from '@/components/layout/SharedLayout';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
    {children}
  </Link>
);

function Events() {
  const { language } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPastEvents, setLoadingPastEvents] = useState<boolean>(false);
  const [pastEventsVisible, setPastEventsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
    
    // Set the language for translations only once on component mount
    setTranslationLanguage(language);
  }, []);
  
  // Update translation language when language changes and force a reload of events
  useEffect(() => {
    if (isClient) {
      console.log('Language changed to:', language);
      setTranslationLanguage(language);
      
      // Force reload of events when language changes
      setLoading(true);
      fetchCalendarEvents().then(allEvents => {
        console.log('Events reloaded after language change, count:', allEvents.length);
        
        // Get upcoming events (max 3)
        const upcoming = getUpcomingEvents(allEvents, 3);
        setUpcomingEvents(upcoming);
        
        // Don't load past events initially - they'll be loaded on demand
        setLoading(false);
      }).catch(error => {
        console.error('Error reloading events after language change:', error);
        setError(language === 'en' ? 'Failed to load events' : 'Napaka pri nalaganju dogodkov');
        setLoading(false);
      });
    }
  }, [language, isClient]);
  
  useEffect(() => {
    // Only fetch events on the client side
    if (!isClient) return;
    
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // This will automatically translate events if language is set to Slovenian
        const allEvents = await fetchCalendarEvents();
        
        // Get upcoming events (max 3)
        const upcoming = getUpcomingEvents(allEvents, 3);
        setUpcomingEvents(upcoming);
        
        // Don't load past events initially - they'll be loaded on demand
        setLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        setError(language === 'en' ? 'Failed to load events from calendar' : 'Napaka pri nalaganju dogodkov');
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [isClient]); // Only re-fetch when client state changes
  
  // Function to load past events when needed
  const loadPastEvents = async () => {
    if (pastEvents.length > 0 || loadingPastEvents) return;
    
    try {
      setLoadingPastEvents(true);
      setPastEventsVisible(true);
      
      const allEvents = await fetchCalendarEvents();
      
      // Get past events (max 3)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const past = allEvents
        .filter(event => event.start < today)
        .sort((a, b) => b.start.getTime() - a.start.getTime()) // Most recent first
        .slice(0, 3);
        
      setPastEvents(past);
      setLoadingPastEvents(false);
    } catch (error) {
      console.error('Error loading past events:', error);
      setLoadingPastEvents(false);
    }
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
  const formatEventTime = (start: Date, end: Date): string => {
    return `${start.toLocaleTimeString(language === 'sl' ? 'sl-SI' : 'en-US', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString(language === 'sl' ? 'sl-SI' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Check if event is in the past
  const isEventInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <>
      <Head>
        <title>{language === 'en' ? 'Events | The Livada Biotope' : 'Dogodki | Biotop Livada'}</title>
        <meta 
          name="description" 
          content={language === 'en' 
            ? "Discover upcoming events at Livada Biotope, from workshops to volunteer opportunities and educational activities." 
            : "Odkrijte prihodnje dogodke v Biotopu Livada, od delavnic do priložnosti za prostovoljstvo in izobraževalne dejavnosti."}
        />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" component="nav">
            <StyledLink href="/">
              {language === 'en' ? 'Home' : 'Domov'}
            </StyledLink>
            {' / '}
            <Typography component="span" color="primary.main" fontWeight="medium" display="inline">
              {language === 'en' ? 'Events' : 'Dogodki'}
            </Typography>
          </Typography>
        </Box>
        
        <Paper elevation={2} sx={{ mb: 6, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
              {language === 'en' ? 'Events' : 'Dogodki'}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {language === 'en'
                ? "Discover upcoming events at Livada Biotope, from workshops to volunteer opportunities and educational activities."
                : "Odkrijte prihodnje dogodke v Biotopu Livada, od delavnic do priložnosti za prostovoljstvo in izobraževalne dejavnosti."}
            </Typography>
          </Box>
        </Paper>
          
        {/* Upcoming Events Section */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 4, color: 'primary.main' }}>
          {language === 'en' ? 'Upcoming Events' : 'Prihajajoči dogodki'}
        </Typography>
        
        {/* Debug info - only visible when explicitly enabled */}
        {false && isClient && process.env.NODE_ENV === 'development' && (
          <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2">Debug Info:</Typography>
            <Typography variant="body2">Client-side rendering: Yes</Typography>
            <Typography variant="body2">Language: {language}</Typography>
            <Typography variant="body2">Loading state: {loading ? 'Loading...' : 'Completed'}</Typography>
            <Typography variant="body2">Upcoming events: {upcomingEvents.length}</Typography>
            <Typography variant="body2">Past events: {pastEvents.length}</Typography>
            {error && <Typography variant="body2" color="error">Error: {error}</Typography>}
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : upcomingEvents.length > 0 ? (
          <Grid container spacing={4}>
            {upcomingEvents.map((event, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <TranslatedEvent 
                  event={event}
                  renderEvent={(translatedEvent) => (
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="h3" gutterBottom color="primary.main">
                          {translatedEvent.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatEventDate(translatedEvent.start)}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {translatedEvent.location}
                        </Typography>
                        
                        <Typography variant="body2" paragraph>
                          {translatedEvent.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        {translatedEvent.url ? (
                          <Button 
                            variant="outlined"
                            href={translatedEvent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ fontWeight: 'medium' }}
                          >
                            {language === 'en' ? 'Event Details' : 'Podrobnosti'}
                          </Button>
                        ) : null}
                      </CardActions>
                    </Card>
                  )}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {language === 'en' ? 'No upcoming events found.' : 'Ni prihajajočih dogodkov.'}
            </Typography>
          </Box>
        )}
        
        {/* Past Events Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom color="text.secondary">
            {language === 'en' ? 'Past Events' : 'Pretekli dogodki'}
          </Typography>
          
          {!pastEventsVisible ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={loadPastEvents}
                sx={{ fontWeight: 'medium' }}
              >
                {language === 'en' ? 'Load Past Events' : 'Naloži pretekle dogodke'}
              </Button>
            </Box>
          ) : loadingPastEvents ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : pastEvents.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="body1" color="text.secondary">
                {language === 'en' ? 'No past events found.' : 'Ni najdenih preteklih dogodkov.'}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {pastEvents.map((event, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <TranslatedEvent 
                    event={event}
                    renderEvent={(translatedEvent) => (
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: 0.8 }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h5" component="h3" gutterBottom color="text.secondary">
                            {translatedEvent.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatEventDate(translatedEvent.start)}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {translatedEvent.location}
                          </Typography>
                          
                          <Typography variant="body2" paragraph>
                            {translatedEvent.description}
                          </Typography>
                        </CardContent>
                        {translatedEvent.url && (
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                              variant="outlined"
                              href={translatedEvent.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ fontWeight: 'medium', color: 'text.secondary', borderColor: 'text.secondary' }}
                            >
                              {language === 'en' ? 'Event Details' : 'Podrobnosti'}
                            </Button>
                          </CardActions>
                        )}
                      </Card>
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        
        {/* Calendar Component */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 8, mb: 4, color: 'primary.main' }}>
          {language === 'en' ? 'Event Calendar' : 'Koledar dogodkov'}
        </Typography>
        
        <Box sx={{ mb: 6 }}>
          <EventCalendar />
        </Box>
        
        {/* Subscribe to Calendar */}
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            href="https://calendar.google.com/calendar/u/0?cid=Y181ZDc4ZWI2NzEyODhjYjEyNmE5MDUyOTJiYjcxOWVhZjk0YWUzYzg0YjExNGIwMmM2MjJkYmE5YWExYzM3Y2I3QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 2, mb: 2 }}
          >
            {language === 'en' ? 'Add to Google Calendar' : 'Dodaj v Google Koledar'}
          </Button>
        </Box>
      </Container>
    </>
  );
}

// Define a custom layout for this page
export const getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export default Events;
