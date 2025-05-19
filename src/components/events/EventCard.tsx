import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import { formatEventDate, formatEventTime } from '@/utils/dateUtils';
import Link from 'next/link';

interface EventCardProps {
  event: CalendarEvent;
  locale: 'en' | 'sl';
  onLearnMore?: (event: CalendarEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, locale, onLearnMore }) => {
  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLearnMore) {
      onLearnMore(event);
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          variant="overline" 
          color="primary"
          component="div"
          sx={{ 
            display: 'inline-block',
            mb: 1,
            fontWeight: 'medium',
            letterSpacing: 1,
          }}
        >
          {formatEventDate(event.start, locale)}
        </Typography>
        
        <Typography 
          variant="h5" 
          component="h3" 
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 1.5,
            minHeight: '3.9em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            mr: 2,
            flexShrink: 0,
          }}>
            <Typography variant="body2" fontWeight="medium">
              {new Date(event.start).getDate()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {formatEventTime(event.start, locale)}
              {event.end && ` - ${formatEventTime(event.end, locale)}`}
            </Typography>
            {event.location && (
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            )}
          </Box>
        </Box>

        {event.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </Typography>
        )}
      </CardContent>
      
      <Box sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          component={Link}
          href={`/events/${event.id}`}
          onClick={handleLearnMore}
          variant="outlined"
          size="small"
          sx={{
            fontWeight: 'medium',
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          {locale === 'sl' ? 'Več o tem' : 'Learn more'}
        </Button>
      </Box>
    </Card>
  );
};

export default EventCard;
