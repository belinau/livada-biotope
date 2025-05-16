// Netlify serverless function to fetch and cache Google Calendar events
const fetch = require('node-fetch');
const ical = require('node-ical');
const NodeCache = require('node-cache');

// Create a cache with a default TTL of 30 minutes (1800 seconds)
const cache = new NodeCache({ stdTTL: 1800 });

// Google Calendar URL (public iCal URL)
const CALENDAR_URL = "https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics";

// Simple translations for event types and common words
const translations = {
  en: {
    workshop: "Workshop",
    lecture: "Lecture",
    community: "Community Event",
    other: "Event"
  },
  sl: {
    workshop: "Delavnica",
    lecture: "Predavanje",
    community: "Skupnostni dogodek",
    other: "Dogodek"
  }
};

// Common event-related terms translations for Slovenian
const commonTerms = {
  // Event types
  'workshop': 'delavnica',
  'lecture': 'predavanje',
  'community': 'skupnost',
  'meeting': 'srečanje',
  
  // Locations
  'Livada Biotope': 'Biotop Livada',
  'Community Garden': 'Skupnostni vrt',
  'Botanical Garden': 'Botanični vrt',
  'Urban Garden': 'Mestni vrt',
  'City Park': 'Mestni park',
  'Nature Reserve': 'Naravni rezervat',
  'Forest': 'Gozd',
  'Meadow': 'Travnik',
  'Online': 'Spletno',
  'Biotop Livada': 'Biotop Livada',
  'LivadaLAB': 'LivadaLAB',
  
  // Common words in event titles
  'Permacultural': 'Permakulturna',
  'workshop': 'delavnica',
  'Workshop': 'Delavnica',
  'Planting': 'Sajenje',
  'Gardening': 'Vrtnarjenje',
  'Composting': 'Kompostiranje',
  'Seed': 'Seme',
  'Seeds': 'Semena',
  'Harvest': 'Pobiranje pridelka',
  'Community': 'Skupnost',
  'Meeting': 'Srečanje',
  'Discussion': 'Razprava',
  'Talk': 'Pogovor',
  'Lecture': 'Predavanje',
  'Presentation': 'Predstavitev'
};

// Function to translate event title to Slovenian
function translateEventTitle(title) {
  if (!title) return '';
  let translated = title;
  Object.entries(commonTerms).forEach(([en, sl]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, sl);
  });
  return translated;
}

// Function to translate event description to Slovenian
function translateEventDescription(description) {
  if (!description) return '';
  let translated = description;
  
  // Translate common phrases
  translated = translated.replace(/Location:/gi, 'Lokacija:');
  translated = translated.replace(/Date:/gi, 'Datum:');
  translated = translated.replace(/Time:/gi, 'Čas:');
  translated = translated.replace(/Description:/gi, 'Opis:');
  
  // Translate common words
  Object.entries(commonTerms).forEach(([en, sl]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, sl);
  });
  
  return translated;
}

// Function to determine event type based on summary and description
function determineEventType(summary, description) {
  const combined = `${summary || ''} ${description || ''}`.toLowerCase();
  if (combined.includes('workshop') || combined.includes('delavnica')) return 'workshop';
  if (combined.includes('lecture') || combined.includes('predavanje')) return 'lecture';
  if (combined.includes('community') || combined.includes('skupnost')) return 'community';
  return 'other';
}

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Check cache first
    const cacheKey = 'calendar-events';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData),
      };
    }

    // Fetch calendar data
    const response = await fetch(CALENDAR_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.statusText}`);
    }
    
    const icsData = await response.text();
    const events = [];
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Parse iCal data
    const parsedData = ical.sync.parseICS(icsData);
    
    // Process events
    for (const [uid, event] of Object.entries(parsedData)) {
      if (event.type !== 'VEVENT') continue;
      
      const start = new Date(event.start);
      const end = new Date(event.end);
      
      // Skip past events
      if (end < now) continue;
      
      // Skip events more than a year in the future
      if (start > oneYearFromNow) continue;
      
      const eventType = determineEventType(event.summary, event.description);
      
      // Create event object
      const formattedEvent = {
        id: uid,
        title: event.summary || 'Event',
        description: event.description || '',
        location: event.location || '',
        start: start.toISOString(),
        end: end.toISOString(),
        type: eventType,
        translations: {
          sl: {
            title: translateEventTitle(event.summary || 'Event'),
            description: translateEventDescription(event.description || ''),
            type: translations.sl[eventType] || translations.sl.other
          },
          en: {
            title: event.summary || 'Event',
            description: event.description || '',
            type: translations.en[eventType] || translations.en.other
          }
        }
      };
      
      events.push(formattedEvent);
    }

    // Sort events by start date
    events.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Cache the result
    cache.set(cacheKey, events);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(events),
    };
    
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch calendar events',
        message: error.message
      }),
    };
  }
};
