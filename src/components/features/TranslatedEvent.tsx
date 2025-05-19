import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarEvent } from '@/types/calendar';
import { 
  translateEventTitle, 
  translateEventDescription, 
  translateEventLocation 
} from '@/lib/translationService';

interface TranslatedEventProps {
  event: CalendarEvent;
  renderEvent: (translatedEvent: CalendarEvent) => React.ReactNode;
}

/**
 * Component that handles translation of event content based on the current language
 */
export const TranslatedEvent: React.FC<TranslatedEventProps> = ({ 
  event, 
  renderEvent 
}) => {
  const { locale } = useLanguage();
  const [translatedEvent, setTranslatedEvent] = useState<CalendarEvent>(event);
  
  // Update translations when language or event changes
  useEffect(() => {
    if (locale === 'sl') {
      // Translate to Slovenian
      const translated: CalendarEvent = {
        ...event,
        title: translateEventTitle(event.title || ''),
        description: event.description ? translateEventDescription(event.description) : undefined,
        location: event.location ? translateEventLocation(event.location) : undefined,
      };
      setTranslatedEvent(translated);
      console.log(`Translated event: "${event.title}" -> "${translated.title}"`);
      console.log(`Translated description: "${event.description?.substring(0, 50)}..." -> "${translated.description?.substring(0, 50)}..."`);
    } else {
      // Use original English content
      setTranslatedEvent(event);
    }
  }, [event, locale]);
  
  // Render the event with translated content
  return <>{renderEvent(translatedEvent)}</>;
};

export default TranslatedEvent;
