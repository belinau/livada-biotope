import type { NextApiRequest, NextApiResponse } from 'next';

const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/c_5d78eb671288cb126a905292bb719eaf94ae3c84b114b02c622dba9aa1c37cb7%40group.calendar.google.com/public/basic.ics';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Add cache-busting parameter
    const cacheBuster = new Date().getTime();
    const url = `${CALENDAR_URL}?_=${cacheBuster}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Accept': 'text/calendar,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    
    return res.status(200).send(data);
  } catch (error) {
    console.error('Calendar API error:', error);
    return res.status(500).json({ 
      message: 'Error fetching calendar data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
