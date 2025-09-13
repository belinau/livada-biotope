import fetch from 'node-fetch';

const PI_API_URL = process.env.PI_API_URL;
const FALLBACK_TIMEOUT = 5000;

exports.handler = async (event, context) => {
    let clientPath = event.path;
    if (!clientPath.startsWith('/')) {
        clientPath = '/' + clientPath;
    }

    const apiEndpoint = '/api' + clientPath;
    console.log(`[api-proxy] Forwarding request to: ${apiEndpoint}`);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (!PI_API_URL) {
        console.error('[api-proxy] PI_API_URL environment variable is not set');
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

        const cleanedPiApiUrl = PI_API_URL.endsWith('/') ? PI_API_URL.slice(0, -1) : PI_API_URL;
        const targetUrl = `${cleanedPiApiUrl}${apiEndpoint}`;
        console.log(`[api-proxy] Attempting to fetch from: ${targetUrl}`);

        const response = await fetch(targetUrl, {
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

        console.error(`[api-proxy] Pi API returned status: ${response.status}`);
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
        console.error('[api-proxy] Pi API fetch failed:', error.message);
        
        return {
            statusCode: 502, // Bad Gateway
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