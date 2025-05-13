# Sideband Plugin Specification for Livada Biotope

## Overview

The Sideband Plugin is a critical component of the Livada Biotope project that facilitates the integration of environmental sensor data from various sources into our web application. This document outlines the technical specifications, data formats, and integration requirements for sensor development teams.

## Architecture

The Sideband Plugin follows a modular architecture with these key components:

1. **Data Collection Layer**: Interfaces with physical sensors and IoT devices
2. **Data Processing Layer**: Normalizes, validates, and transforms raw sensor data
3. **Data Storage Layer**: Manages persistent storage of sensor readings
4. **API Layer**: Provides endpoints for the web application to consume sensor data
5. **Visualization Layer**: Renders sensor data in the web interface

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Physical       │     │  Sideband       │     │  Livada         │
│  Sensors        │────▶│  Plugin         │────▶│  Biotope        │
│  Network        │     │  System         │     │  Web App        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Sensor Data Requirements

### Supported Sensor Types

The Sideband Plugin currently supports the following sensor types:

| Sensor Type        | Measurement Units | Value Range       | Resolution  |
|--------------------|-------------------|-------------------|-------------|
| Soil Moisture      | Percentage (%)    | 0-100%            | 0.1%        |
| Air Temperature    | Celsius (°C)      | -40°C to +85°C    | 0.1°C       |
| Soil Temperature   | Celsius (°C)      | -20°C to +50°C    | 0.1°C       |
| Humidity           | Percentage (%)    | 0-100%            | 0.1%        |
| Light Intensity    | Lux               | 0-65535 lux       | 1 lux       |
| Air Pressure       | hPa               | 300-1100 hPa      | 0.1 hPa     |
| Rainfall           | mm                | 0-500 mm          | 0.2 mm      |
| Wind Speed         | m/s               | 0-60 m/s          | 0.1 m/s     |
| Wind Direction     | Degrees           | 0-359°            | 1°          |
| CO2 Concentration  | ppm               | 0-5000 ppm        | 1 ppm       |

### Data Format

Sensor data must be transmitted in JSON format with the following structure:

```json
{
  "device_id": "string",
  "timestamp": "ISO8601 string",
  "location": {
    "latitude": "float",
    "longitude": "float",
    "altitude": "float (optional)"
  },
  "readings": [
    {
      "sensor_type": "string (from supported types)",
      "value": "float",
      "unit": "string",
      "quality": "integer (0-100, optional)"
    }
  ],
  "metadata": {
    "battery_level": "float (percentage, optional)",
    "signal_strength": "integer (dBm, optional)",
    "firmware_version": "string (optional)"
  }
}
```

## Communication Protocol

### Data Transmission

The Sideband Plugin supports multiple communication protocols for sensor data:

1. **HTTP/HTTPS REST API**
   - Endpoint: `https://livada.bio/api/sideband/readings`
   - Method: POST
   - Authentication: API key in header (`X-Sideband-API-Key`)
   - Content-Type: `application/json`

2. **MQTT**
   - Broker: `mqtt.livada.bio`
   - Port: 8883 (TLS)
   - Topic: `livada/sensors/{device_id}/readings`
   - QoS: 1 (At least once)
   - Authentication: Username/password or client certificates

3. **Reticulum Network**
   - For mesh network deployments
   - Protocol: Reticulum (https://reticulum.network/)
   - Transport: LoRa or WiFi
   - Encryption: AES-256

### Authentication

All sensor devices must be registered in the Sideband management portal before they can transmit data. Registration provides:

- Device ID
- Authentication credentials
- Access permissions

## Hardware Integration

### Supported Hardware Platforms

The Sideband Plugin has been tested with the following hardware platforms:

1. **Arduino-based**
   - Arduino Uno/Mega with appropriate shields
   - ESP8266/ESP32 modules
   - Arduino MKR series

2. **Raspberry Pi**
   - All Raspberry Pi models
   - Requires Python 3.6+ for the Sideband client library

3. **Mobile Devices**
   - Android devices with Sideband Collector app
   - iOS devices with Sideband Collector app

4. **Custom Hardware**
   - Must implement the Sideband communication protocol
   - Must support one of the transmission methods

### Minimum Requirements

- Processing: 16MHz+ microcontroller or equivalent
- Memory: 32KB RAM minimum (64KB+ recommended)
- Storage: 256KB flash minimum
- Power: Battery-operated devices must implement power-saving modes
- Connectivity: WiFi, Ethernet, LoRa, or Cellular

## Data Processing

### Sampling Rates

Recommended sampling rates for different sensor types:

| Sensor Type        | Minimum Sampling Rate | Recommended Sampling Rate |
|--------------------|----------------------|---------------------------|
| Soil Moisture      | Once per hour        | Once per 15 minutes       |
| Air Temperature    | Once per hour        | Once per 5 minutes        |
| Soil Temperature   | Once per hour        | Once per 30 minutes       |
| Humidity           | Once per hour        | Once per 5 minutes        |
| Light Intensity    | Once per hour        | Once per 5 minutes        |
| Air Pressure       | Once per hour        | Once per 15 minutes       |
| Rainfall           | Once per hour        | Once per 5 minutes        |
| Wind Speed         | Once per hour        | Once per minute           |
| Wind Direction     | Once per hour        | Once per minute           |
| CO2 Concentration  | Once per hour        | Once per 15 minutes       |

### Data Validation

The Sideband Plugin performs the following validation on incoming data:

1. **Range Validation**: Ensures values are within the specified ranges
2. **Consistency Checks**: Detects anomalous readings
3. **Timestamp Validation**: Ensures readings have valid timestamps
4. **Device Authentication**: Verifies the device is authorized

## Integration with Livada Biotope Web Application

The Sideband Plugin integrates with the Livada Biotope web application through:

1. **Real-time Data Display**
   - Current readings displayed on dashboards
   - Configurable alerts for threshold violations

2. **Historical Data Analysis**
   - Time-series visualization
   - Data export functionality
   - Statistical analysis tools

3. **Spatial Visualization**
   - Map-based visualization of sensor locations
   - Heatmaps of environmental conditions

## Development Resources

### Client Libraries

- **JavaScript/TypeScript**: `@livada/sideband-client`
- **Python**: `livada-sideband-client`
- **Arduino**: `LivadaSideband.h`
- **C/C++**: `libsideband`

### Testing Tools

- Sideband Simulator: Generates test data for development
- Sideband Inspector: Monitors and debugs data transmission
- Sideband Validator: Validates data format and content

### Documentation

- Full API documentation: https://docs.livada.bio/sideband-api
- Example implementations: https://github.com/livada-bio/sideband-examples
- Troubleshooting guide: https://docs.livada.bio/sideband-troubleshooting

## Implementation Timeline

1. **Phase 1 (Completed)**: Core infrastructure and API development
2. **Phase 2 (Current)**: Sensor network deployment and data collection
3. **Phase 3 (Upcoming)**: Advanced analytics and machine learning integration

## Contact Information

For technical support or questions about the Sideband Plugin:

- Email: sideband-support@livada.bio
- GitHub Issues: https://github.com/livada-bio/sideband-plugin/issues
- Developer Forum: https://community.livada.bio/sideband

## License

The Sideband Plugin is licensed under the MIT License. See LICENSE.md for details.
