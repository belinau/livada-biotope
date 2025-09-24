import fetch from 'node-fetch';

const PI_API_URL = process.env.PI_API_URL;
const FALLBACK_TIMEOUT = 5000;
const MAX_RETRIES = 2;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
const OFFLINE_CACHE_TTL = 30 * 60 * 1000; // 30 minutes for offline scenarios

// Simple in-memory cache (will reset with each function instance)
let cache = {};
let cacheTimestamp = {};

// Detect if the error is due to DNS resolution/network connectivity issues
const isConnectivityError = (error) => {
    return error.message.includes('ENOTFOUND') || 
           error.message.includes('ECONNREFUSED') || 
           error.message.includes('ETIMEDOUT') ||
           error.message.includes('ENETUNREACH') ||
           error.message.includes('EAI_AGAIN');
};

exports.handler = async (event, context) => {
    let clientPath = event.path;
    if (!clientPath.startsWith('/')) {
        clientPath = '/' + clientPath;
    }

    const apiEndpoint = clientPath.replace(/^\/api/, '');
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

    // Check cache first (with extended TTL if we're in an offline scenario)
    const cacheKey = `${event.httpMethod}:${apiEndpoint}`;
    const now = Date.now();
    
    if (cache[cacheKey] && (now - cacheTimestamp[cacheKey]) < CACHE_TTL) {
        console.log(`[api-proxy] Serving from cache: ${cacheKey}`);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(cache[cacheKey])
        };
    }

    // Implement retry logic with exponential backoff
    let lastError;
    let hasConnectivityIssue = false;
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), FALLBACK_TIMEOUT);

            const cleanedPiApiUrl = PI_API_URL.endsWith('/') ? PI_API_URL.slice(0, -1) : PI_API_URL;
            const targetUrl = `${cleanedPiApiUrl}${apiEndpoint}`;
            console.log(`[api-proxy][attempt ${attempt + 1}] Attempting to fetch from: ${targetUrl}`);

            const response = await fetch(targetUrl, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                
                // Cache successful responses
                const responseBody = {
                    data,
                    source: 'pi',
                    timestamp: new Date().toISOString()
                };
                
                cache[cacheKey] = responseBody;
                cacheTimestamp[cacheKey] = now;
                
                // If we had connectivity issues before, clear the extended cache TTL flag
                console.log(`[api-proxy] Successfully fetched fresh data, updating cache`);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(responseBody)
                };
            } else {
                console.error(`[api-proxy][attempt ${attempt + 1}] Pi API returned status: ${response.status}`);
                lastError = new Error(`Pi API returned status: ${response.status}`);
            }

        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`[api-proxy][attempt ${attempt + 1}] Pi API fetch failed:`, error.message);
            lastError = error;
            
            // Check if this is a connectivity issue
            if (isConnectivityError(error)) {
                hasConnectivityIssue = true;
            }

            // If this was the last attempt, break out of the loop
            if (attempt === MAX_RETRIES) {
                break;
            }

            // Exponential backoff: wait 1s, then 2s for retries
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`[api-proxy][attempt ${attempt + 1}] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // If we reach here, all attempts failed
    console.error('[api-proxy] All retry attempts failed, checking cache for fallback data');
    
    // Serve from cache if available, with extended TTL during connectivity issues
    if (cache[cacheKey]) {
        const cacheAge = now - cacheTimestamp[cacheKey];
        const maxCacheAge = hasConnectivityIssue ? OFFLINE_CACHE_TTL : CACHE_TTL;
        
        if (cacheAge < maxCacheAge) {
            console.log(`[api-proxy] Serving cached data (age: ${Math.floor(cacheAge/1000)}s) as fallback: ${cacheKey}`);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...cache[cacheKey],
                    source: 'cache-fallback',
                    warning: hasConnectivityIssue 
                        ? `Serving cached data due to connectivity issues (cached ${Math.floor(cacheAge/1000)}s ago)` 
                        : 'Serving cached data due to API failure',
                    timestamp: new Date().toISOString()
                })
            };
        } else {
            console.log(`[api-proxy] Cached data is too old (age: ${Math.floor(cacheAge/1000)}s), not serving`);
        }
    }

    // If no cache available or too old, return error but with more context
    return {
        statusCode: 502, // Bad Gateway
        headers,
        body: JSON.stringify({
            data: {},
            source: 'proxy-error',
            error: `Failed to connect to Pi API after ${MAX_RETRIES + 1} attempts: ${lastError.message}`,
            timestamp: new Date().toISOString(),
            ...(hasConnectivityIssue && { 
                message: "The sensor API server appears to be offline. Please check the Raspberry Pi connection to Tailscale." 
            })
        })
    };
};