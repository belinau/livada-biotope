import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
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
import CircularProgress from '@mui/material/CircularProgress';

// Define styled links to avoid TypeScript errors with '&:hover'
const StyledLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
    {children}
  </Link>
);

// Define the event interface
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string | Date;
  end: string | Date;
  location: string;
  type: 'workshop' | 'lecture' | 'community' | 'other';
  url?: string;
}

function Events() {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pastEventsVisible, setPastEventsVisible] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Function to fetch events from the serverless function
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Set locale based on language
      const locale = language === 'sl' ? 'sl' : 'en';

      // Use Netlify serverless function to fetch calendar events
      const functionUrl = `/.netlify/functions/calendar?locale=${locale}`;

      const response = await fetch(functionUrl);

      if (!response.ok) {
        throw new Error(`Error fetching from serverless function: ${response.status}`);
      }

      const events: CalendarEvent[] = await response.json();
      
      // Process events and separate into upcoming and past
      if (!events || events.length === 0) {
        setError(t('events.error.noEvents', 'No events found'));
        setLoading(false);
        return;
      }

      // Convert string dates to Date objects
      const processedEvents = events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));

      // Get upcoming events (next 3 months)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = processedEvents
        .filter(event => event.start >= today)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 3);

      setUpcomingEvents(upcoming);

      // Get past events (last 3 months)
      const past = processedEvents
        .filter(event => event.start < today)
        .sort((a, b) => b.start.getTime() - a.start.getTime()) // Most recent first
        .slice(0, 3);
        
      setPastEvents(past);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(t('events.error.fetchFailed', 'Failed to load events. Please try again later.'));
      setLoading(false);
    }
  }, [language, t]);

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch events when the component mounts or language changes
  useEffect(() => {
    if (isClient) {
      fetchEvents();
    }
  }, [isClient, fetchEvents]);




  
  // Toggle past events visibility
  const togglePastEvents = () => {
    setPastEventsVisible(!pastEventsVisible);
  };

  // Format date for display
  const formatEventDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatEventTime = (startInput: string | Date, endInput: string | Date): string => {
    const start = typeof startInput === 'string' ? new Date(startInput) : startInput;
    const end = typeof endInput === 'string' ? new Date(endInput) : endInput;
    return `${start.toLocaleTimeString(language === 'sl' ? 'sl-SI' : 'en-US', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString(language === 'sl' ? 'sl-SI' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      <Head>
        <title>{language === 'en' ? 'Events | The Livada Biotope' : 'Dogodki | Biotop Livada'}</title>
        <meta 
          name="description" 
          content={t('events.description', 'Discover upcoming events at Livada Biotope, from workshops to volunteer opportunities and educational activities.')}
        />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" component="nav">
            <StyledLink href="/">
              {t('nav.home', 'Home')}
            </StyledLink>
            {' / '}
            <Typography component="span" color="primary.main" fontWeight="medium" display="inline">
              {t('nav.events', 'Events')}
            </Typography>
          </Typography>
        </Box>
        
        <Paper elevation={2} sx={{ mb: 6, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
              {t('events.pageTitle', 'Events')}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {t('events.description', 'Discover upcoming events at Livada Biotope, from workshops to volunteer opportunities and educational activities.')}
            </Typography>
          </Box>
        </Paper>
          
        {/* Upcoming Events Section */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 4, color: 'primary.main' }}>
          {t('events.upcomingEvents', 'Upcoming Events')}
        </Typography>
        
        {upcomingEvents.length > 0 ? (
          <Grid container spacing={3}>
            {upcomingEvents.map(event => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {formatEventDate(event.start)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {formatEventTime(event.start, event.end)}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {event.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('events.location', 'Location:')} </strong> {event.location}
                    </Typography>
                  </CardContent>
                  {event.url && (
                    <CardActions>
                      <Button size="small" color="primary" href={event.url} target="_blank">
                        {t('common.learnMore', 'Learn More')}
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="body1" color="text.secondary">
              {t('events.noUpcomingEvents', 'No upcoming events at the moment. Check back soon!')}
            </Typography>
          </Paper>
        )}
        
        {/* Past Events Section */}
        {pastEvents.length > 0 && pastEventsVisible && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
              {t('events.pastEvents', 'Past Events')}
            </Typography>
            
            <Grid container spacing={3}>
              {pastEvents.map(event => (
                <Grid item xs={12} md={4} key={event.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {formatEventDate(event.start)}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {formatEventTime(event.start, event.end)}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {event.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{language === 'en' ? 'Location:' : 'Lokacija:'}</strong> {event.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Toggle Past Events Button */}
        {pastEvents.length > 0 && (
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={togglePastEvents}
            >
              {pastEventsVisible
                ? (language === 'en' ? 'Hide Past Events' : 'Skrij pretekle dogodke')
                : (language === 'en' ? 'View Past Events' : 'Ogled preteklih dogodkov')
              }
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}

// Define a custom layout for this page
Events.getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

// No longer need getStaticProps as we're fetching data client-side

export default Events;
