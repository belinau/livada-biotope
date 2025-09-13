# Data Access for Livada.bio Telemetry

This document provides the necessary information for external systems, like Home Assistant, to access telemetry data collected by the livada.bio project.

## Overview

Data originates from Meshtastic nodes and is processed by `sensor_munch.py` running on a Raspberry Pi (`biotop`). This script stores data in a local SQLite database (`livada.db`) and makes it available via two primary methods:

1.  A RESTful API served by `api_server.py`.
2.  A real-time WebSocket stream also managed by `sensor_munch.py`.

Both services are exposed to the public internet using Tailscale Funnel.

## Access URLs

These are the public endpoints you can use to access the data.

**API Base URL:**
`https://biotop.tailbf4c09.ts.net/api`

**WebSocket URL:**
`wss://biotop.tailbf4c09.ts.net:8765`

*Note: The API uses standard HTTPS (port 443), while the WebSocket uses a specific TCP port (8765) handled by Tailscale Funnel.*

## API Access (`api_server.py`)

The API provides historical and near-real-time data from the SQLite database. It uses standard HTTP methods.

### Endpoints

-   `GET /api/health`
    -   *Description:* Check if the API server is running.
    -   *Response:* `{"status": "healthy", "timestamp": "..."}`

-   `GET /api/telemetry/live`
    -   *Description:* Retrieve telemetry data from the last 24 hours.
    -   *Response:* A JSON object where keys are `node_id`s and values are arrays of telemetry records.
    -   *Example Snippet:*
        ```json
        {
          "!76208ba5": [
            {
              "timestamp": "2025-08-24T14:30:00Z",
              "environment_metrics": { ... },
              "device_metrics": { ... }
            },
            ...
          ],
          ...
        }
        ```

-   `GET /api/telemetry/history`
    -   *Description:* Retrieve historical telemetry data. By default, it fetches the last 7 days.
    -   *Parameters:*
        -   `days=N` (e.g., `?days=30`): Get data for the last N days.
        -   `start_date=YYYY-MM-DD` & `end_date=YYYY-MM-DD` (e.g., `?start_date=2025-08-01&end_date=2025-08-10`): Get data within a specific date range.
    -   *Response:* Same format as `/live`.

### Example API Call (using curl)

To get live data:
`curl https://biotop.tailbf4c09.ts.net/api/telemetry/live`

## WebSocket Access (`sensor_munch.py`)

The WebSocket provides a real-time stream of telemetry updates as they are received by the `sensor_munch.py` script. This is the most immediate way to get data.

### Connection

Connect your WebSocket client to: `wss://biotop.tailbf4c09.ts.net:8765`

### Data Format

Messages received via the WebSocket are JSON strings. Each message corresponds to a single telemetry update from a node. The structure is slightly different from the API's historical data format.

-   `nodeId`: The unique ID of the node (e.g., `!76208ba5`).
-   `nodeName`: The human-readable name of the node.
-   `batteryLevel`: Device battery level (if available).
-   `voltage`: Device voltage (if available).
-   `sensors`: (For soil sensor nodes) An array containing data from individual soil sensors (J1, J2, J3).
-   `weather`: (For the weather station node) An object containing air temperature, humidity, pressure, etc.
-   `lastHeard`: A timestamp indicating when this data was received.

### Example WebSocket Message (using websocat or a client library)

Upon connection, you will start receiving messages like this:
```json
{
  "nodeId": "!76208ba5",
  "nodeName": "Hummingbird",
  "batteryLevel": 100,
  "voltage": 4.15,
  "sensors": [
    { "address": "0x21", "moisture": 25.5, "temperature": 22.1 },
    { "address": "0x22", "moisture": 24.8, "temperature": 21.9 },
    { "address": "0x23", "moisture": 26.2, "temperature": 22.3 }
  ],
  "lastHeard": 1756047218000
}
```

## Development Environment Setup

Setting up the development environment for the livada.bio web application requires careful configuration to properly connect to the sensor API server. Below are the detailed steps and configurations needed.

### Prerequisites

1. Install Node.js (version 14 or higher)
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Clone the livada-bio repository
4. Install project dependencies: `npm install`

### Netlify Dev Configuration

The key challenge in development is routing API requests from the local development server to the sensor API server running on the Raspberry Pi. Our solution involves using Netlify's proxy capabilities combined with Tailscale for secure access.

#### 1. Netlify.toml Configuration

Our `netlify.toml` file contains the essential proxy configuration:

```toml
[build]
  command = "npm run build"
  publish = "build"

[functions]
  directory = "netlify/functions"

[dev]
  publish = "build"
  port = 3001

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api-proxy/:splat"
  status = 200

[[redirects]]
  from = "/calendar-proxy/*"
  to = "/.netlify/functions/calendar-proxy"
  status = 200
```

The redirects section is crucial as it routes all `/api/*` requests through our custom proxy functions.

#### 2. Proxy Functions Implementation

We've implemented two proxy functions to handle API requests:

**API Proxy Function (`/netlify/functions/api-proxy.js`):**

```javascript
const fetch = require('node-fetch');

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
```

**Calendar Proxy Function (`/netlify/functions/calendar-proxy.js`):**

```javascript
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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'Accept': 'text/calendar, text/plain, */*'
      }
    });
    const icsData = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Access-Control-Allow-Origin': '*',
        'X-Proxied-Url': url
      },
      body: icsData
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          error: 'Failed to fetch calendar data',
          details: error.message,
          url: url
      })
    };
  }
};
```

#### 3. Environment Variables Setup

Create a `.env.development` file in the project root with the following configuration:

```env
# Point to your Raspberry Pi API server via Tailscale
PI_API_URL=https://biotop.tailbf4c09.ts.net
REACT_APP_PI_API_URL=/api
REACT_APP_PI_WS_URL=wss://biotop.tailbf4c09.ts.net:8765

# Netlify specific variables (optional for local dev)
NETLIFY_SITE_ID=your-site-id-here
NETLIFY_AUTH_TOKEN=your-auth-token-here
```

The key variables are:
- `PI_API_URL`: The base URL of your Raspberry Pi API server accessible via Tailscale
- `REACT_APP_PI_API_URL`: The client-side path that gets proxied (should be `/api`)
- `REACT_APP_PI_WS_URL`: The WebSocket URL for real-time data streaming

#### 4. Running the Development Server

To start the development environment with proper API connectivity:

1. Ensure your machine is connected to Tailscale and can access the Pi
2. Verify connectivity to the Pi: `curl https://biotop.tailbf4c09.ts.net/api/health`
3. Start the Netlify development server: `netlify dev` or `ntl dev`

The server will start on `http://localhost:3001` and automatically proxy API requests to your Raspberry Pi.

#### 5. Troubleshooting Common Issues

**Issue: "Pi API fetch failed: getaddrinfo ENOTFOUND"**
Solution: Ensure you're connected to Tailscale and can resolve the Pi's hostname. Test with: `ping biotop.tailbf4c09.ts.net`

**Issue: "PI_API_URL environment variable is not set"**
Solution: Verify your `.env.development` file exists and contains the correct `PI_API_URL` value.

**Issue: CORS errors in browser console**
Solution: Our proxy functions include proper CORS headers. Ensure you're accessing the app via `localhost:3001` and not directly via Webpack's dev server.

**Issue: WebSocket connection fails**
Solution: Verify the WebSocket URL in `REACT_APP_PI_WS_URL` and ensure port 8765 is accessible through Tailscale Funnel.

#### 6. Production vs Development Configuration

In production, the app is served directly from Netlify and API requests are proxied through Netlify's redirect rules. In development, we use the Netlify CLI's built-in proxy server which mimics this behavior.

The key differences:
- Production: Netlify handles redirects automatically
- Development: Netlify CLI simulates the redirect behavior locally

Both environments route API requests through our proxy functions to ensure consistent behavior.

### Tailscale Setup

For the Raspberry Pi to be accessible during development:

1. Install Tailscale on the Pi: `curl -fsSL https://tailscale.com/install.sh | sh`
2. Authenticate the Pi to your Tailscale network
3. Enable Tailscale Funnel for the Pi:
   ```bash
   sudo tailscale funnel 443 tcp://localhost:8000  # For API server
   sudo tailscale funnel 8765 tcp://localhost:8765  # For WebSocket
   ```
4. Note the generated Tailscale URL (e.g., `biotop.tailbf4c09.ts.net`) and use it in your environment variables

This setup ensures secure, encrypted access to your sensor data during both development and production without exposing your Pi directly to the internet.
