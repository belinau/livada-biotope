// Netlify serverless function to fetch and cache Google Calendar events
const fetch = require('node-fetch');
const ical = require('node-ical');
const NodeCache = require('node-cache');

// Create a cache with a default TTL of 30 minutes (1800 seconds)
const cache = new NodeCache({ stdTTL: 1800 });

// Google Calendar URL (public iCal URL)
const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics';

// Simple translations for event types and common words
const translations = {
  en: {
    workshop: 'Workshop',
    lecture: 'Lecture',
    community: 'Community Event',
    other: 'Event'
  },
  sl: {
    workshop: 'Delavnica',
    lecture: 'Predavanje',
    community: 'Skupnostni dogodek',
    other: 'Dogodek'
  }
};

exports.handler = async (event, context) => {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*', // Replace with your domain in production
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle OPTIONS request (preflight)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight request successful' })
      };
    }

    // Parse query parameters
    const params = event.queryStringParameters || {};
    const locale = params.locale || 'en';
    
    // Create a cache key based on the locale
    const cacheKey = `calendar_events_${locale}`;

    // Check if we have a cached response
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Serving cached calendar data for locale: ${locale}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData)
      };
    }

    // Add cache-busting parameter to avoid stale data
    const cacheBuster = new Date().getTime();
    const url = `${CALENDAR_URL}?_=${cacheBuster}`;
    
    // Fetch iCal data from Google Calendar with retry logic
    console.log(`Fetching calendar data from: ${url}`);
    let response;
    let retries = 3;
    
    while (retries > 0) {
      try {
        response = await fetch(url, {
          headers: {
            'User-Agent': 'LivadaBiotope/1.0 (https://livada-biotope.netlify.app/)',
            'Accept': 'text/calendar,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          // Add timeout to prevent hanging requests
          timeout: 10000
        });
        
        if (response.ok) break;
        
        console.log(`Calendar API error: ${response.status}. Retrying... (${retries} attempts left)`);
        retries--;
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`Fetch error: ${error.message}. Retrying... (${retries} attempts left)`);
        retries--;
        if (retries === 0) throw error;
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!response || !response.ok) {
      // If API fails, return empty events array instead of throwing an error
      // This prevents the UI from breaking
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    const icalData = await response.text();
    
    // Parse iCal data
    const parsedEvents = ical.parseICS(icalData);
    
    // Convert to our event format
    const events = [];
    
    for (const key in parsedEvents) {
      const event = parsedEvents[key];
      
      // Only process VEVENT items
      if (event.type !== 'VEVENT') continue;
      
      // Determine event type based on summary/description
      const eventText = `${event.summary || ''} ${event.description || ''}`.toLowerCase();
      let eventType = 'other';
      
      if (eventText.includes('workshop') || eventText.includes('delavnica')) {
        eventType = 'workshop';
      } else if (eventText.includes('lecture') || eventText.includes('talk') || eventText.includes('predavanje')) {
        eventType = 'lecture';
      } else if (eventText.includes('community') || eventText.includes('skupnost')) {
        eventType = 'community';
      }
      
      // Basic translation of event title and description
      let title = event.summary || translations[locale][eventType];
      let description = event.description || '';
      
      // Very simple translation logic - in a real app, use a proper translation service
      if (locale === 'sl' && title.includes('Workshop')) {
        title = title.replace('Workshop', 'Delavnica');
      } else if (locale === 'sl' && title.includes('Lecture')) {
        title = title.replace('Lecture', 'Predavanje');
      } else if (locale === 'sl' && title.includes('Community Event')) {
        title = title.replace('Community Event', 'Skupnostni dogodek');
      }
      
      // Format the event
      const formattedEvent = {
        id: event.uid || `event-${events.length + 1}`,
        title,
        description,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        location: event.location || 'Livada Biotope',
        type: eventType,
        url: event.url || null
      };
      
      events.push(formattedEvent);
    }
    
    // Sort events by start date
    events.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Store the processed data in cache
    cache.set(cacheKey, events);
    
    // Return the processed events
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(events)
    };
  } catch (error) {
    console.error('Error in calendar function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Error fetching calendar data',
        message: error.message
      })
    };
  }
};
