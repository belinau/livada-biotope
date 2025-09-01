import React, { useState, useEffect, useMemo } from 'react';
import ICAL from 'ical.js';
import pLimit from 'p-limit';
import { useTranslation } from '../context/LanguageContext';
import { GlassCard } from './ui/GlassCard';

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
        className={`p-4 rounded-xl transition-all duration-300 ${ 
          isPast ? 'bg-bg-main/50 opacity-70' : 'bg-white/10 hover:bg-white/20'
        } backdrop-blur-sm border border-border-color/30 shadow-lg`}
      >
        <div className="font-semibold text-base text-text-main">{event.summary}</div>
        <div className="text-sm text-text-muted mt-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {fmt(event.startDate)}
        </div>
        {event.location && (
          <div className="text-sm text-text-muted mt-1 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        )}
        {event.description && (
          <div className="text-sm text-text-main mt-3 whitespace-pre-wrap break-words border-t border-border-color/20 pt-3">
            {event.description}
          </div>
        )}
      </li>
    );
  };

const CalendarFeed = ({ icsUrl, calendarUrl }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
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
              const jcalData = ICAL.parse(icsText);
              const comp = new ICAL.Component(jcalData);
              const vevents = comp.getAllSubcomponents('vevent');
              const parsed = vevents.map(vevent => {
                  const event = new ICAL.Event(vevent);
                  
                  // Get the start date properly
                  const startDate = event.startDate ? event.startDate.toJSDate() : null;
                  
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
              return sorted;
          } catch (e) {
              console.error("Error parsing ICS file:", e);
              return [];
          }
      };
    
      const proxy = '/.netlify/functions/calendar-proxy?url=';
      limit(() => fetch(proxy + encodeURIComponent(icsUrl), { signal }))
        .then(r => {
          if (!r.ok) {
            throw new Error(`HTTP ${r.status}`);
          }
          return r.text();
        })
        .then(t => {
          const parsedEvents = parseICS(t);
          setEvents(parsedEvents);
          setError(null);
        })
        .catch(e => {
          if (e.name !== 'AbortError') {
            console.error('ICS error:', e);
            setError(t('calendarFetchError') || 'Error fetching events from calendar.');
            setEvents([]);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      return () => {
        controller.abort();
      };
    }, [icsUrl, t, retryCount]);
  
    /* -------- events for the current month -------- */
    const currentMonthEvents = useMemo(() => {
      const monthStart = new Date(viewYear, viewMonth, 1);
      const monthEnd = new Date(viewYear, viewMonth + 1, 1);
  
      return events.filter(
        (e) => {
          const eventDate = new Date(e.startDate);
          return eventDate >= monthStart && eventDate < monthEnd;
        }
      );
    }, [events, viewYear, viewMonth]);
  
    if (isLoading) {
      return (
        <GlassCard className="max-w-2xl mx-auto" padding="p-8" rounded="2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full mb-4">
              <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
              </svg>
            </div>
            <p className="text-body text-text-muted">{t('loading')}...</p>
          </div>
        </GlassCard>
      );
    }
    
    if (error) {
      return (
        <GlassCard className="max-w-2xl mx-auto" padding="p-8" rounded="2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sunset to-red-600 rounded-full mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-body text-text-muted mb-4">{error}</p>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setRetryCount(prev => prev + 1);
              }}
              className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('retry')}
            </button>
          </div>
        </GlassCard>
      );
    }
    
    // Check if we have events but none in the current month
    const hasEvents = events.length > 0;
    const hasCurrentMonthEvents = currentMonthEvents.length > 0;
  
    const monthName = new Date(viewYear, viewMonth).toLocaleString(language, {
      month: 'long',
      year: 'numeric',
    });
  
    return (
      <GlassCard className="max-w-2xl mx-auto" padding="p-6" rounded="2xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-200 backdrop-blur-sm border border-border-color/30 shadow-sm"
            aria-label={t('previousMonth')}
          >
            <svg className="w-5 h-5 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="font-bold text-xl text-text-main">{monthName}</h3>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-200 backdrop-blur-sm border border-border-color/30 shadow-sm"
            aria-label={t('nextMonth')}
          >
            <svg className="w-5 h-5 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
  
        <ul className="space-y-4">
          {hasCurrentMonthEvents ? (
            currentMonthEvents.map((e) => (
              <EventRow key={e.uid} event={e} lang={language} />
            ))
          ) : hasEvents ? (
            <li className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-body text-text-muted">{t('noUpcomingEvents')}</p>
            </li>
          ) : (
            <li className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-text-muted/20 to-text-muted/10 rounded-full mb-3">
                <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-body text-text-muted">{t('noEventsFound')}</p>
            </li>
          )}
        </ul>
  
        <div className="mt-8 pt-6 border-t border-border-color/30 text-center">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-border-color/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
      </GlassCard>
    );
  };

export default CalendarFeed;