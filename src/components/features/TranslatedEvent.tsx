import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarEvent } from '@/lib/calendarService';
import { 
  translateEventTitle, 
  translateEventDescription, 
  translateEventLocation,
  setTranslationLanguage 
} from '@/lib/translationService';

interface TranslatedEventProps {
  event: CalendarEvent;
  renderEvent: (translatedEvent: CalendarEvent) => React.ReactNode;
}

/**
 * Component that handles translation of event content based on the current language
 */
export const TranslatedEvent: React.FC<TranslatedEventProps> = ({ event, renderEvent }) => {
  const { language } = useLanguage();
  const [translatedEvent, setTranslatedEvent] = useState<CalendarEvent>(event);
  
  // Update translations when language or event changes
  useEffect(() => {
    // Set the translation language in the calendar service
    setTranslationLanguage(language);
    
    if (language === 'sl') {
      // Translate to Slovenian
      // Update the event with translated content
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
  }, [event, language]);
  
  // Render the event with translated content
  return <>{renderEvent(translatedEvent)}</>;
};
