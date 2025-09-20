import fetch from 'node-fetch';

// Google Sheets API endpoint (configured via environment variables)
const LEADERBOARD_SHEET_URL = process.env.LEADERBOARD_SHEET_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRwR7Plya2_ngzbrgOVdzb60XlSBeEGsAx2hxdFbZl--h3Aiy9ggzEfVIhrHa8hb0YpiSCpRBFJ_yuo/pub?output=csv';

// Google Sheets API endpoint (configured via environment variables)
const GOOGLE_FORM_URL = process.env.GOOGLE_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLScu1ESoEi4E4l4IZ13kSukhOxdfvS7UK6e3yccTp-PjuOoxIA/formResponse';
const NAME_FIELD_ID = process.env.GOOGLE_FORM_NAME_FIELD || 'entry.337335141';
const SCORE_FIELD_ID = process.env.GOOGLE_FORM_SCORE_FIELD || 'entry.1278609628';

// Add better error logging
console.log('[leaderboard] Function initialized with:');
console.log('[leaderboard] GOOGLE_FORM_URL:', GOOGLE_FORM_URL);
console.log('[leaderboard] NAME_FIELD_ID:', NAME_FIELD_ID);
console.log('[leaderboard] SCORE_FIELD_ID:', SCORE_FIELD_ID);
console.log('[leaderboard] LEADERBOARD_SHEET_URL:', LEADERBOARD_SHEET_URL);

// Read leaderboard data from Google Sheets CSV
const readLeaderboardFromSheets = async () => {
  try {
    console.log('[leaderboard] Fetching data from:', LEADERBOARD_SHEET_URL);
    const response = await fetch(LEADERBOARD_SHEET_URL);
    
    if (!response.ok) {
      console.error('[leaderboard] Failed to fetch Google Sheets data:', response.status, response.statusText);
      throw new Error(`Failed to fetch Google Sheets data: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('[leaderboard] Raw CSV data:');
    console.log(JSON.stringify(csvText));
    
    // Parse CSV data
    const lines = csvText.trim().split('\n');
    console.log('[leaderboard] Number of lines in CSV:', lines.length);
    
    if (lines.length < 2) {
      console.log('[leaderboard] Not enough data in CSV, returning empty scores');
      return { scores: [] };
    }
    
    const headersLine = lines[0];
    const dataLines = lines.slice(1);
    console.log('[leaderboard] Headers line:', JSON.stringify(headersLine));
    
    // Extract column names (handle quoted fields)
    const columns = parseCSVLine(headersLine);
    console.log('[leaderboard] Parsed columns:', columns);
    
    // Find column indices based on exact column names (not partial matches)
    const timestampColIndex = columns.findIndex(col => col.toLowerCase().trim() === 'timestamp');
    const nameColIndex = columns.findIndex(col => col.toLowerCase().trim() === 'name' || col.toLowerCase().trim() === 'ime');
    const scoreColIndex = columns.findIndex(col => col.toLowerCase().trim() === 'score' || col.toLowerCase().trim() === 'tocke' || col.toLowerCase().trim() === 'točke');
    
    console.log('[leaderboard] Initial column indices - Timestamp:', timestampColIndex, 'Name:', nameColIndex, 'Score:', scoreColIndex);
    
    // Override with known correct indices for Google Forms data
    // Google Forms CSV always has: Timestamp (0), Name (1), Score (2)
    const correctedTimestampColIndex = 0;
    const correctedNameColIndex = 1;
    const correctedScoreColIndex = 2;
    
    console.log('[leaderboard] Corrected column indices - Timestamp:', correctedTimestampColIndex, 'Name:', correctedNameColIndex, 'Score:', correctedScoreColIndex);
    
    // Parse data rows
    const scores = dataLines.map((line, index) => {
      console.log(`[leaderboard] Processing line ${index}:`, JSON.stringify(line));
      
      // Handle quoted fields that may contain commas
      const values = parseCSVLine(line);
      console.log(`[leaderboard] Parsed line ${index} values:`, values);
      
      // Extract values using hardcoded correct indices for Google Forms data
      // Google Forms CSV always has: Timestamp (0), Name (1), Score (2)
      const timestamp = values[0] || new Date().toISOString();
      const name = values[1] || '';
      const score = values[2] ? parseInt(values[2], 10) : 0;
      const date = timestamp; // Use timestamp as date
      
      console.log(`[leaderboard] Extracted values - Timestamp: "${timestamp}", Name: "${name}" (type: ${typeof name}), Score: ${score} (type: ${typeof score})`);
      
      // Only include valid scores
      if (name && name.trim() !== '' && !isNaN(score) && score > 0) {
        const trimmedName = name.trim();
        console.log(`[leaderboard] Adding valid score - Name: "${trimmedName}", Score: ${score}`);
        return {
          id: Date.now() + index,
          name: trimmedName,
          score: score,
          date: date
        };
      } else {
        console.log(`[leaderboard] Skipping row - Name valid: ${!!name}, Name not empty: ${name && name.trim() !== ''}, Score valid: ${!isNaN(score) && score > 0}`);
      }
      
      return null;
    }).filter(score => score !== null)
    .sort((a, b) => a.score - b.score); // Sort by score (ascending - lower is better)
    
    console.log('[leaderboard] Final scores array:', scores);
    return { scores };
  } catch (error) {
    console.error('[leaderboard] Error reading from Google Sheets:', error);
    return { scores: [] };
  }
};

// Submit score to Google Form
const submitScoreToForm = async (name, score) => {
  try {
    console.log(`[leaderboard] Submitting score: ${name} - ${score}`);
    console.log(`[leaderboard] Form URL: ${GOOGLE_FORM_URL}`);
    console.log(`[leaderboard] Name Field ID: ${NAME_FIELD_ID}`);
    console.log(`[leaderboard] Score Field ID: ${SCORE_FIELD_ID}`);
    
    const formData = new URLSearchParams();
    formData.append(NAME_FIELD_ID, name);
    formData.append(SCORE_FIELD_ID, score.toString());
    formData.append('fvv', '1');
    formData.append('draftResponse', '[]');
    formData.append('pageHistory', '0');
    
    console.log(`[leaderboard] Form data to submit:`, Object.fromEntries(formData));
    
    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'follow'
    });
    
    console.log(`[leaderboard] Form submission response status: ${response.status}`);
    console.log(`[leaderboard] Form submission response headers:`, Object.fromEntries(response.headers));
    
    if (!response.ok) {
      throw new Error(`Google Form submission failed: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('[leaderboard] Error submitting to Google Form:', error);
    return false;
  }
};

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Handle GET request - fetch leaderboard from Google Sheets
    if (event.httpMethod === 'GET') {
      const leaderboard = await readLeaderboardFromSheets();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(leaderboard)
      };
    }

    // Handle POST request - submit new score to Google Form
    if (event.httpMethod === 'POST') {
      const { name, score } = JSON.parse(event.body);
      
      // Validate input
      if (!name || typeof score !== 'number' || score <= 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid input: name and valid score are required' })
        };
      }

      // Submit score to Google Form
      const success = await submitScoreToForm(name, score);
      
      if (success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Score submitted successfully!',
            success: true
          })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to submit score to Google Form',
            success: false
          })
        };
      }
    }

    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('[leaderboard] Unexpected error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}

// Helper function to parse CSV lines properly
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      // Check if this is an escaped quote
      if (i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip the next quote
      } else {
        inQuotes = false;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last value
  values.push(current.trim());
  
  return values;
};