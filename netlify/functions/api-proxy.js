const fetch = require('node-fetch');

const PI_API_URL = process.env.PI_API_URL; // Your Tailscale Pi URL
const FALLBACK_TIMEOUT = 5000; // 5 second timeout

exports.handler = async (event, context) => {
        const fullPath = event.path;
    const functionBase = '/.netlify/functions/api-proxy';
    let apiEndpoint = fullPath.substring(functionBase.length);

    if (!apiEndpoint.startsWith('/')) {
        apiEndpoint = '/' + apiEndpoint;
    }
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (!PI_API_URL) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'PI_API_URL environment variable is not set.',
                source: 'proxy-error',
                timestamp: new Date().toISOString()
            })
        };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FALLBACK_TIMEOUT);
        
        const response = await fetch(`${PI_API_URL}/api${apiEndpoint}`, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    data,
                    source: 'pi',
                    timestamp: new Date().toISOString()
                })
            };
        }
        
        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify({
                error: `Pi API returned status: ${response.status}`,
                source: 'pi-api-error',
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        console.log('Pi API fetch failed:', error.message);
        
        return {
            statusCode: 504, // Gateway Timeout
            headers,
            body: JSON.stringify({
                data: {},
                source: 'proxy-error',
                error: `Failed to connect to Pi API: ${error.message}`,
                timestamp: new Date().toISOString()
            })
        };
    }
};