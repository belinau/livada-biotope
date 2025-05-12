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

// Function to generate mock events for testing
function generateMockEvents(locale) {
  const now = new Date();
  const eventTypes = ["workshop", "lecture", "community", "other"];
  const events = [];
  
  // Generate 5 upcoming events
  for (let i = 0; i < 5; i++) {
    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() + (i * 3) + 1);
    
    const startTime = new Date(eventDate);
    startTime.setHours(10 + i, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
    
    const eventType = eventTypes[i % eventTypes.length];
    
    events.push({
      id: `mock-event-${i + 1}`,
      title: locale === "sl" 
        ? `${translations.sl[eventType]} ${i + 1}: Biotop Livada` 
        : `${translations.en[eventType]} ${i + 1}: Livada Biotope`,
      description: locale === "sl"
        ? `To je testni dogodek za Biotop Livada. Pridružite se nam za zanimivo aktivnost!`
        : `This is a test event for Livada Biotope. Join us for an exciting activity!`,
      start: startTime,
      end: endTime,
      location: "Livada Biotope, Ljubljana, Slovenia",
      type: eventType,
      url: "https://livada.bio/events"
    });
  }
  
  // Generate 3 past events
  for (let i = 0; i < 3; i++) {
    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() - (i * 5) - 1);
    
    const startTime = new Date(eventDate);
    startTime.setHours(14 + i, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1, 30);
    
    const eventType = eventTypes[(i + 2) % eventTypes.length];
    
    events.push({
      id: `mock-past-event-${i + 1}`,
      title: locale === "sl" 
        ? `Pretekli ${translations.sl[eventType]} ${i + 1}` 
        : `Past ${translations.en[eventType]} ${i + 1}`,
      description: locale === "sl"
        ? `To je pretekli testni dogodek za Biotop Livada. Hvala vsem udeležencem!`
        : `This is a past test event for Livada Biotope. Thanks to all participants!`,
      start: startTime,
      end: endTime,
      location: "Livada Biotope, Ljubljana, Slovenia",
      type: eventType,
      url: "https://livada.bio/events"
    });
  }
  
  return events;
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

    // Generate mock events
    const mockEvents = generateMockEvents(locale);
    
    // Cache the mock events
    cache.set(cacheKey, mockEvents);
    
    // Return the mock events
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockEvents)
    };
    
  } catch (error) {
    console.error("Serverless function error:", error);
    
    // Generate mock events as a fallback for any error
    const locale = (event.queryStringParameters || {}).locale || "en";
    const mockEvents = generateMockEvents(locale);
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mockEvents)
    };
  }
};
