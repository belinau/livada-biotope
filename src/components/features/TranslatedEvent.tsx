import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarEvent } from '@/lib/calendarService';
import { translateEventTitle, translateEventDescription, translateEventLocation } from '@/lib/translationService';
import { setTranslationLanguage } from '@/lib/calendarService';

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
      const translated: CalendarEvent = {
        ...event,
        title: translateEventTitle(event.title),
        description: translateEventDescription(event.description),
        location: translateEventLocation(event.location)
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
