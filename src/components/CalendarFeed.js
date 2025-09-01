import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ICAL from 'ical.js';
import pLimit from 'p-limit';
import { useTranslation } from '../App';

const limit = pLimit(2); // Limit to 2 concurrent requests

/* -------- EventRow component -------- */
const EventRow = ({ event, lang, isPast }) => {
    const fmt = (d) => {
      if (!d) return '';
      // Ensure d is a Date object
      const date = new Date(d);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleString(lang, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    };
  
    return (
      <li
        className={`p-3 rounded-lg shadow-sm ${ 
          isPast ? 'bg-bg-main opacity-70' : 'bg-primary/5'
        }`}
      >
        <div className="font-semibold text-sm">{event.summary}</div>
        <div className="text-xs text-text-muted mt-1">{fmt(event.startDate)}</div>
        {event.location && (
          <div className="text-xs text-text-muted mt-1">📍 {event.location}</div>
        )}
        {event.description && (
          <div className="text-xs text-text-main mt-2 whitespace-pre-wrap break-words">
            {event.description}
          </div>
        )}
      </li>
    );
  };

const CalendarFeed = ({ icsUrl, calendarUrl }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useTranslation();
  
    /* -------- month navigation -------- */
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
  
    const changeMonth = (delta) => {
      const d = new Date(viewYear, viewMonth + delta, 1);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    };
  
    /* -------- fetch & parse -------- */
    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;
  
      const parseICS = (icsText) => {
          try {
              console.log('Parsing ICS text:', icsText.substring(0, 500) + '...'); // Debug log
              const jcalData = ICAL.parse(icsText);
              const comp = new ICAL.Component(jcalData);
              const vevents = comp.getAllSubcomponents('vevent');
              console.log('Found VEVENTs:', vevents.length); // Debug log
              const parsed = vevents.map(vevent => {
                  const event = new ICAL.Event(vevent);
                  
                  // Get the start date properly
                  const startDate = event.startDate ? event.startDate.toJSDate() : null;
                  
                  console.log('Event data:', { // Debug log
                      uid: event.uid,
                      summary: event.summary,
                      description: event.description,
                      location: event.location,
                      startDate: startDate,
                  });
                  
                  return {
                      uid: event.uid,
                      summary: event.summary || '',
                      description: event.description || '',
                      location: event.location || '',
                      startDate: startDate,
                  };
              });
              
              // Filter out events without valid start dates
              const filtered = parsed.filter(event => event.startDate && !isNaN(event.startDate.getTime()));
              const sorted = filtered.sort((a, b) => +a.startDate - +b.startDate);
              console.log('Parsed events:', sorted); // Debug log
              return sorted;
          } catch (e) {
              console.error("Error parsing ICS file:", e);
              return [];
          }
      };
    
      const proxy = 'https://api.allorigins.win/raw?url=';
      console.log('Fetching ICS from:', proxy + encodeURIComponent(icsUrl)); // Debug log
      limit(() => fetch(proxy + encodeURIComponent(icsUrl), { signal }))
        .then(r => {
          console.log('Fetch response:', r.status, r.ok); // Debug log
          return r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`));
        })
        .then(t => {
          console.log('Received ICS text length:', t.length); // Debug log
          setEvents(parseICS(t));
        })
        .catch(e => {
          if (e.name !== 'AbortError') {
            console.error('ICS error:', e);
            // Set events to empty array to stop loading state
            setEvents([]);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      return () => {
        controller.abort();
      };
    }, [icsUrl]);
  
    /* -------- events for the current month -------- */
    const currentMonthEvents = useMemo(() => {
      const monthStart = new Date(viewYear, viewMonth, 1);
      const monthEnd = new Date(viewYear, viewMonth + 1, 1);
      
      console.log('Filtering events for month:', monthStart, 'to', monthEnd); // Debug log
      console.log('All events:', events); // Debug log
  
      return events.filter(
        (e) => {
          const eventDate = new Date(e.startDate);
          const result = eventDate >= monthStart && eventDate < monthEnd;
          console.log('Event date check:', eventDate, '>=', monthStart, '&&', eventDate, '<', monthEnd, '=>', result); // Debug log
          return result;
        }
      );
    }, [events, viewYear, viewMonth]);
  
    if (isLoading) return <div className="text-body text-center text-text-muted">{t('loading')}...</div>;
    
    // Check if we have events but none in the current month
    const hasEvents = events.length > 0;
    const hasCurrentMonthEvents = currentMonthEvents.length > 0;
  
    const monthName = new Date(viewYear, viewMonth).toLocaleString(language, {
      month: 'long',
      year: 'numeric',
    });
  
    return (
      <div className="max-w-2xl mx-auto bg-[var(--glass-bg)] backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-[var(--glass-border)]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20"
          >
            &larr;
          </button>
          <span className="font-bold text-lg">{monthName}</span>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20"
          >
            &rarr;
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20"
          >
            &larr;
          </button>
          <span className="font-bold text-lg">{monthName}</span>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 rounded bg-primary/10 hover:bg-primary/20"
          >
            &rarr;
          </button>
        </div>
  
        <ul className="space-y-4">
          {hasCurrentMonthEvents ? (
            currentMonthEvents.map((e) => (
              <EventRow key={e.uid} event={e} lang={language} />
            ))
          ) : hasEvents ? (
            <p className="text-center text-text-muted">{t('noUpcomingEvents')}</p>
          ) : (
            <p className="text-center text-text-muted">{t('noEventsFound')}</p>
          )}
        </ul>
  
        <div className="mt-6 text-center">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            {t('openInGoogleCalendar')}
          </a>
        </div>
      </div>
    );
  };

export default CalendarFeed;