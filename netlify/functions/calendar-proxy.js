const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' })
    };
  }
  
  try {
    const response = await fetch(url);
    const icsData = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*' // Adjust for production
      },
      body: icsData
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch calendar data' })
    };
  }
};