
export const transformApiData = (apiData) => {
    // Handle case where apiData might be undefined or null
    if (!apiData) {
        return {};
    }

    if (typeof apiData !== 'object' || Array.isArray(apiData) || apiData === null) {
        throw new Error('Unexpected API data format: expected an object of nodes.');
    }

    const transformed = {};

    for (const nodeId in apiData) {
        const readings = apiData[nodeId];

        if (!Array.isArray(readings) || readings.length === 0) {
            continue;
        }

        // Check if this reading has environment metrics
        if (readings[0].environment_metrics && Object.keys(readings[0].environment_metrics).length > 0) {
            const envReadings = readings.filter(r => r.environment_metrics && Object.keys(r.environment_metrics).length > 0);

            // Determine node type based on available metrics in ALL readings, not just the first one
            // This is important for datasets where the first reading might not contain soil data
            const isSoilNode = envReadings.some(r => r.environment_metrics.soil_temperature_j1 !== undefined);
            const isWeatherNode = envReadings.some(r => r.environment_metrics.air_temperature !== undefined);

            if (isSoilNode) {
                for (let i = 1; i <= 3; i++) {
                    const tempKey = `soil_temperature_j${i}`;
                    const moistKey = `soil_moisture_j${i}`;

                    // Check if these keys exist in the data
                    const hasTempData = envReadings.some(r => r.environment_metrics[tempKey] !== undefined);
                    const hasMoistData = envReadings.some(r => r.environment_metrics[moistKey] !== undefined);

                    if (hasTempData) {
                        const tempSeries = envReadings
                            .map(r => ({ x: r.timestamp, y: r.environment_metrics[tempKey] }))
                            .filter(p => p.y != null && p.y !== undefined);

                        if (tempSeries.length > 0) {
                            transformed[`${nodeId}-${i-1}-temperature`] = tempSeries;
                        }
                    }

                    if (hasMoistData) {
                        const moistSeries = envReadings
                            .map(r => ({ x: r.timestamp, y: r.environment_metrics[moistKey] }))
                            .filter(p => p.y != null && p.y !== undefined);

                        if (moistSeries.length > 0) {
                            transformed[`${nodeId}-${i-1}-moisture`] = moistSeries;
                        }
                    }
                }
            } else if (isWeatherNode) {
                // Process air temperature
                const airTempSeries = envReadings
                    .map(r => ({ x: r.timestamp, y: r.environment_metrics.air_temperature }))
                    .filter(p => p.y != null && p.y !== undefined);

                if (airTempSeries.length > 0) {
                    transformed.airTemperature = airTempSeries;
                }

                // Process air humidity
                const airHumidSeries = envReadings
                    .map(r => ({ x: r.timestamp, y: r.environment_metrics.air_humidity }))
                    .filter(p => p.y != null && p.y !== undefined);

                if (airHumidSeries.length > 0) {
                    transformed.airHumidity = airHumidSeries;
                }
            }
        }
    }
    return transformed;
};
