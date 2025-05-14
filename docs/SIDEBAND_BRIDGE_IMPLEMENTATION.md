# Sideband Bridge Implementation

## Overview

The Sideband Bridge is a lightweight implementation that connects the Livada Biotope web application to sensor data sources. It provides a simplified HTTP API for accessing sensor telemetry without requiring a full Sideband Plugin installation.

## Architecture

The Sideband Bridge uses a dual-architecture approach:

1. **Development Environment**: A standalone Python HTTP server running locally
2. **Production Environment**: A Netlify serverless function integrated with the web application

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Physical       │     │  Sideband       │     │  Livada         │
│  Sensors        │────▶│  Bridge         │────▶│  Biotope        │
│  Network        │     │  Server/Function│     │  Web App        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## API Endpoints

The Sideband Bridge provides the following endpoints:

| Endpoint       | Method | Description                               | Response Format |
|----------------|--------|-------------------------------------------|-----------------|
| `/api/data`    | GET    | Returns sensor data readings              | JSON Array      |
| `/api/status`  | GET    | Returns bridge connection status          | JSON Object     |
| `/api/debug`   | GET    | Returns detailed diagnostic information   | JSON Object     |

### Data Endpoint Format

```json
[
  {
    "timestamp": "2025-05-14T16:00:00Z",
    "sensorId": 1,
    "moisture": 45.2
  },
  {
    "timestamp": "2025-05-14T16:00:00Z",
    "sensorId": 2,
    "moisture": 32.7
  }
]
```

### Status Endpoint Format

```json
{
  "status": "online",
  "timestamp": "2025-05-14T16:00:00Z",
  "environment": "production",
  "sideband_hash": "a3641ddf337fcb827bdc092a4d9fd9de"
}
```

## Development Implementation

In the development environment, the Sideband Bridge is implemented as a standalone Python HTTP server:

1. **File**: `sideband_debug_bridge.py` (stored in `~/Sideband_bridge/`)
2. **Language**: Python 3.6+
3. **Dependencies**: Standard library only (http.server, json)
4. **Starting the Bridge**:
   ```bash
   cd ~/Sideband_bridge
   python3 sideband_debug_bridge.py
   ```
5. **Configuration**: Uses `.env.local` environment variables

## Production Implementation

In the production environment, the Sideband Bridge is implemented as a Netlify serverless function:

1. **File**: `netlify/functions/sideband-bridge.js`
2. **Language**: JavaScript (Node.js)
3. **Dependencies**: None (uses built-in Netlify function capabilities)
4. **Deployment**: Automatic with site deployment
5. **Configuration**: Uses `.env.production` environment variables

## Environment Configuration

### Development Environment

File: `.env.local`
```
NEXT_PUBLIC_SIDEBAND_HOST=localhost
NEXT_PUBLIC_SIDEBAND_PORT=4242
NEXT_PUBLIC_SIDEBAND_HASH=a3641ddf337fcb827bdc092a4d9fd9de
```

### Production Environment

File: `.env.production`
```
NEXT_PUBLIC_SIDEBAND_HOST=api
NEXT_PUBLIC_SIDEBAND_PORT=443
NEXT_PUBLIC_SIDEBAND_HASH=a3641ddf337fcb827bdc092a4d9fd9de
```

## Web Application Integration

The Sideband Bridge integrates with the Livada Biotope web application through:

1. **ReticulumClient**: A TypeScript client that handles communication with the bridge
2. **SensorService**: A service that manages data sources and connection status
3. **SensorVisualization**: A React component that displays sensor data

## Error Handling

The Sideband Bridge implements robust error handling:

1. **Connection Timeouts**: Defaults to 5-second timeouts for all requests
2. **Fallback Data**: Generates realistic mock data when real data is unavailable
3. **Status Indicators**: Provides visual feedback of connection status
4. **Error Messages**: Returns descriptive error messages for troubleshooting

## Security Considerations

1. **CORS**: All endpoints have appropriate CORS headers for cross-origin requests
2. **Hash Verification**: Uses a hash to verify authorized connections
3. **Environment Variables**: Sensitive configuration stored in environment variables
4. **No Authentication**: Current implementation does not require authentication

## Future Improvements

1. **Authentication**: Add token-based authentication for API endpoints
2. **WebSocket Support**: Add real-time updates via WebSocket connections
3. **Data Persistence**: Add optional data storage for historical analysis
4. **Additional Sensor Types**: Expand beyond soil moisture to other sensor types
5. **Full Plugin Integration**: Develop a complete Sideband Plugin implementation

## Troubleshooting

Common issues and solutions:

1. **Connection Refused**: Ensure the bridge is running and port is correct
2. **CORS Errors**: Check browser console for CORS-related errors
3. **Invalid Data Format**: Verify the API is returning the expected JSON format
4. **Environment Variables**: Confirm environment variables are correctly set
