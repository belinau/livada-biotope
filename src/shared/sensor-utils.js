export const transformApiData = (apiData) => {
    // Handle case where apiData might be undefined or null
    if (!apiData) {
        return {};
    }

    if (typeof apiData !== 'object' || Array.isArray(apiData) || apiData === null) {
        throw new Error('Unexpected API data format: expected an object of nodes.');
    }

    const transformed = {};

    // PAX counter node IDs (current: !1641e779 tester, future: !c467c5cc gnezdo)
    const PAX_COUNTER_NODES = ['!1641e779', '!c467c5cc'];

    for (const nodeId in apiData) {
        const readings = apiData[nodeId];

        if (!Array.isArray(readings) || readings.length === 0) {
            continue;
        }

        // Filter to only readings that have SOME data (non-empty environment_metrics or pax_metrics with values)
        const validReadings = readings.filter(r => {
            const env = r.environment_metrics || {};
            const pax = r.pax_metrics || {};
            
            const hasEnv = Object.keys(env).length > 0 && Object.values(env).some(v => v !== null && v !== undefined);
            const hasPax = (pax.wifi !== null && pax.wifi !== undefined) || (pax.ble !== null && pax.ble !== undefined);
            
            return hasEnv || hasPax;
        });

        // Skip nodes with no valid readings
        if (validReadings.length === 0) {
            continue;
        }

        // Check for PAX counter data (from tester or gnezdo node)
        if (PAX_COUNTER_NODES.includes(nodeId.toLowerCase())) {
            const paxReadings = validReadings.filter(r => r.pax_metrics);

            if (paxReadings.length > 0) {
                // Process WiFi count
                const wifiSeries = paxReadings
                    .map(r => ({ x: r.timestamp, y: r.pax_metrics.wifi }))
                    .filter(p => p.y != null && p.y !== undefined);

                if (wifiSeries.length > 0) {
                    transformed.paxWifi = wifiSeries;
                }

                // Process BLE count
                const bleSeries = paxReadings
                    .map(r => ({ x: r.timestamp, y: r.pax_metrics.ble }))
                    .filter(p => p.y != null && p.y !== undefined);

                if (bleSeries.length > 0) {
                    transformed.paxBle = bleSeries;
                }
            }
        }

        // Process environment metrics from valid readings
        const envReadings = validReadings.filter(r => r.environment_metrics && Object.keys(r.environment_metrics).length > 0);

        if (envReadings.length > 0) {
            // Determine node type based on available metrics
            // FIX: Check for actual number values, not just !== null (undefined !== null is true!)
            const isSoilNode = envReadings.some(r => 
                typeof r.environment_metrics.soil_temperature_j1 === 'number' || 
                typeof r.environment_metrics.soil_moisture_j1 === 'number' ||
                typeof r.environment_metrics.soil_temperature_j2 === 'number' || 
                typeof r.environment_metrics.soil_moisture_j2 === 'number'
            );
            
            const isWeatherNode = envReadings.some(r => 
                typeof r.environment_metrics.air_temperature === 'number'
            );

            if (isSoilNode) {
                for (let i = 1; i <= 3; i++) {
                    const tempKey = `soil_temperature_j${i}`;
                    const moistKey = `soil_moisture_j${i}`;

                    // Check if these keys exist with actual number values
                    const hasTempData = envReadings.some(r => typeof r.environment_metrics[tempKey] === 'number');
                    const hasMoistData = envReadings.some(r => typeof r.environment_metrics[moistKey] === 'number');

                    if (hasTempData) {
                        const tempSeries = envReadings
                            .map(r => ({ x: r.timestamp, y: r.environment_metrics[tempKey] }))
                            .filter(p => typeof p.y === 'number');

                        if (tempSeries.length > 0) {
                            transformed[`${nodeId}-${i-1}-temperature`] = tempSeries;
                        }
                    }

                    if (hasMoistData) {
                        const moistSeries = envReadings
                            .map(r => ({ x: r.timestamp, y: r.environment_metrics[moistKey] }))
                            .filter(p => typeof p.y === 'number');

                        if (moistSeries.length > 0) {
                            transformed[`${nodeId}-${i-1}-moisture`] = moistSeries;
                        }
                    }
                }
            }
            
            if (isWeatherNode) {
                // Process air temperature
                const airTempSeries = envReadings
                    .map(r => ({ x: r.timestamp, y: r.environment_metrics.air_temperature }))
                    .filter(p => typeof p.y === 'number');

                if (airTempSeries.length > 0) {
                    transformed.airTemperature = airTempSeries;
                }

                // Process air humidity
                const airHumidSeries = envReadings
                    .map(r => ({ x: r.timestamp, y: r.environment_metrics.air_humidity }))
                    .filter(p => typeof p.y === 'number');

                if (airHumidSeries.length > 0) {
                    transformed.airHumidity = airHumidSeries;
                }

                // Process wind speed
                const windSpeedSeries = envReadings
                    .map(r => ({ x: r.timestamp, y: r.environment_metrics.wind_speed }))
                    .filter(p => typeof p.y === 'number');

                if (windSpeedSeries.length > 0) {
                    transformed.windSpeed = windSpeedSeries;
                }

                // Process wind gust
                const windGustSeries = envReadings
                    .map(r => ({ x: r.timestamp, y: r.environment_metrics.wind_gust }))
                    .filter(p => typeof p.y === 'number');

                if (windGustSeries.length > 0) {
                    transformed.windGust = windGustSeries;
                }

                // Process wind direction
                const windDirectionSeries = envReadings
                    .map(r => ({ x: r.timestamp, y: r.environment_metrics.wind_direction }))
                    .filter(p => typeof p.y === 'number');

                if (windDirectionSeries.length > 0) {
                    transformed.windDirection = windDirectionSeries;
                }
            }
        }
    }

    console.log('[transformApiData] Transformed keys:', Object.keys(transformed));
    return transformed;
};
