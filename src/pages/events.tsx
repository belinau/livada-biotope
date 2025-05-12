import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { GetStaticProps } from 'next';
import path from 'path';
import fs from 'fs';

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
  start: string;
  end: string;
  location: string;
  type: 'workshop' | 'lecture' | 'community' | 'other';
  url?: string;
}

interface EventsProps {
  staticEvents: CalendarEvent[];
}

function Events({ staticEvents }: EventsProps) {
  const { language } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<CalendarEvent[]>([]);
  const [pastEventsVisible, setPastEventsVisible] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
    processEvents();
  }, []);
  
  // Update when language changes
  useEffect(() => {
    if (isClient) {
      processEvents();
    }
  }, [language, isClient]);
  
  // Process events and separate into upcoming and past
  const processEvents = () => {
    if (!staticEvents || staticEvents.length === 0) {
      return;
    }
    
    // Convert string dates to Date objects for comparison
    const processedEvents = staticEvents.map(event => ({
      ...event,
      startDate: new Date(event.start),
      endDate: new Date(event.end)
    }));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get upcoming events
    const upcoming = processedEvents
      .filter(event => event.startDate >= today)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 3);
    
    setUpcomingEvents(upcoming.map(event => ({
      ...event,
      title: translateText(event.title, language),
      description: translateText(event.description, language),
      location: translateText(event.location, language)
    })));
    
    // Get past events
    const past = processedEvents
      .filter(event => event.startDate < today)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(0, 3);
      
    setPastEvents(past.map(event => ({
      ...event,
      title: translateText(event.title, language),
      description: translateText(event.description, language),
      location: translateText(event.location, language)
    })));
  };
  
  // Simple translation function (in a real app, use a proper translation service)
  const translateText = (text: string, lang: string): string => {
    // This is a placeholder - in a real app, implement proper translations
    return text;
  };
  
  // Toggle past events visibility
  const togglePastEvents = () => {
    setPastEventsVisible(!pastEventsVisible);
  };

  // Format date for display
  const formatEventDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatEventTime = (startStr: string, endStr: string): string => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return `${start.toLocaleTimeString(language === 'sl' ? 'sl-SI' : 'en-US', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString(language === 'sl' ? 'sl-SI' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
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
                      <strong>{language === 'en' ? 'Location:' : 'Lokacija:'}</strong> {event.location}
                    </Typography>
                  </CardContent>
                  {event.url && (
                    <CardActions>
                      <Button size="small" color="primary" href={event.url} target="_blank">
                        {language === 'en' ? 'Learn More' : 'Več informacij'}
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
              {language === 'en' ? 'No upcoming events at the moment. Check back soon!' : 'Trenutno ni prihajajočih dogodkov. Preverite kmalu!'}
            </Typography>
          </Paper>
        )}
        
        {/* Past Events Section */}
        {pastEvents.length > 0 && pastEventsVisible && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
              {language === 'en' ? 'Past Events' : 'Pretekli dogodki'}
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

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Read the events data from the JSON file
    const eventsFilePath = path.join(process.cwd(), 'src/content/events/events.json');
    const eventsData = fs.readFileSync(eventsFilePath, 'utf8');
    const events = JSON.parse(eventsData);
    
    return {
      props: {
        staticEvents: events
      }
    };
  } catch (error) {
    console.error('Error loading events data:', error);
    
    // Return empty events array if there's an error
    return {
      props: {
        staticEvents: []
      }
    };
  }
};

export default Events;
