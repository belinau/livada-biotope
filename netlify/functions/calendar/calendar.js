// Netlify serverless function to fetch and cache Google Calendar events
const fetch = require("node-fetch");
const ical = require("node-ical");
const NodeCache = require("node-cache");

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
  let translatedTitle = title;
  
  // Check for common terms and replace them
  Object.keys(commonTerms).forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    translatedTitle = translatedTitle.replace(regex, commonTerms[term]);
  });
  
  // Handle specific patterns like "Workshop #2" -> "Delavnica #2"
  translatedTitle = translatedTitle.replace(/Workshop #(\d+)/gi, 'Delavnica #$1');
  
  return translatedTitle;
}

// Function to translate event description to Slovenian
function translateEventDescription(description) {
  if (!description) return '';
  
  let translatedDescription = description;
  
  // Check for common terms and replace them
  Object.keys(commonTerms).forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    translatedDescription = translatedDescription.replace(regex, commonTerms[term]);
  });
  
  return translatedDescription;
}

// Function to determine event type based on summary and description
function determineEventType(summary, description) {
  const text = (summary + ' ' + description).toLowerCase();
  if (text.includes('workshop') || text.includes('delavnica')) {
    return "workshop";
  } else if (text.includes('lecture') || text.includes('predavanje')) {
    return "lecture";
  } else if (text.includes('community') || text.includes('skupnost')) {
    return "community";
  } else {
    return "other";
  }
}

exports.handler = async (event, context) => {
  try {
    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    // Handle OPTIONS request (preflight)
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "CORS preflight request successful" })
      };
    }

    // Parse query parameters
    const params = event.queryStringParameters || {};
    const locale = params.locale || "en";
    
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

    // Fetch events from Google Calendar
    try {
      console.log(`Fetching calendar data from: ${CALENDAR_URL}`);
      
      // Fetch the iCal data
      const response = await fetch(CALENDAR_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar data: ${response.status}`);
      }
      
      const icalData = await response.text();
      
      // Parse the iCal data using node-ical
      const events = await ical.parseICS(icalData);
      
      // Process the events into our format
      const processedEvents = [];
      
      for (const [key, event] of Object.entries(events)) {
        // Skip non-event entries (like timezones)
        if (event.type !== 'VEVENT') continue;
        
        // Process the event
        const eventType = determineEventType(event.summary, event.description || '');
        
        // Skip events without start or end dates
        if (!event.start || !event.end) continue;
        
        // Create a processed event object
        const processedEvent = {
          id: key,
          title: locale === 'sl' ? translateEventTitle(event.summary) : event.summary,
          description: locale === 'sl' ? translateEventDescription(event.description || '') : event.description || '',
          start: event.start.toISOString(),
          end: event.end.toISOString(),
          location: event.location || '',
          type: translations[locale][eventType] || eventType
        };
        
        processedEvents.push(processedEvent);
      }
      
      // Sort events by start date
      processedEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
      
      // Create the response object with the expected format
      const responseData = {
        events: processedEvents
      };
      
      // Cache the response
      cache.set(cacheKey, responseData);
      
      // Return the response
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseData)
      };
      
    } catch (calendarError) {
      console.error("Error fetching calendar data:", calendarError);
      
      // Return an error response
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Failed to fetch calendar data",
          message: calendarError.message
        })
      };
    }
    
  } catch (error) {
    console.error("Serverless function error:", error);
    
    // Return an error response
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        error: "Server error",
        message: error.message
      })
    };
  }
};
