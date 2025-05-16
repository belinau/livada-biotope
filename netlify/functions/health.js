// Simple health check endpoint for Netlify functions
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      functions: {
        sideband: '/.netlify/functions/sideband-bridge/status',
        translations: '/.netlify/functions/translations',
        calendar: '/.netlify/functions/calendar',
        inaturalist: '/.netlify/functions/inaturalist'
      }
    })
  };
};
