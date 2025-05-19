'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Box, Container, Typography, Paper, Skeleton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { Button, Link as MuiLink } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

// Import the type and component separately
import type { EnhancedEventCalendarProps } from '@/components/features/EnhancedEventCalendar';
import type { CalendarEvent } from '@/components/features/EnhancedEventCalendar';

// Dynamic import with type assertion
const EnhancedEventCalendar = dynamic<EnhancedEventCalendarProps>(
  () => import('@/components/features/EnhancedEventCalendar').then(mod => mod.default as any),
  { 
    ssr: false,
    loading: () => <Skeleton variant="rectangular" height={600} />
  }
);

interface EventsPageProps {
  params: {
    locale: string;
  };
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
}

export async function generateMetadata({
  params: { locale },
}: EventsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'events.metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
      siteName: 'Livada Biotope',
    },
  };
}

export default async function EventsPage({ params: { locale } }: EventsPageProps) {
  // Set the request locale for this page
  setRequestLocale(locale);
  
  const t = useTranslations('events');
  
  // Mock events data - replace with your actual data fetching logic
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: t('sampleEvent.title'),
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 2)),
      description: t('sampleEvent.description'),
      location: t('sampleEvent.location'),
    },
    // Add more events as needed
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom color="primary.main">
          {t('title')}
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
            {t('joinCommunity')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('description')}
          </Typography>
        </Paper>

        <Box sx={{ mb: 6 }}>
          <EnhancedEventCalendar
            locale={locale as 'en' | 'sl'}
            events={events}
            showUpcomingEvents={true}
            maxUpcomingEvents={5}
          />
        </Box>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box maxWidth="800px" mx="auto">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontSize: '1.5rem', mb: 2 }}>
              {t('hostEvent.title')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {t('hostEvent.description')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={MuiLink}
              href="/contact"
              size="large"
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              {t('hostEvent.button')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}