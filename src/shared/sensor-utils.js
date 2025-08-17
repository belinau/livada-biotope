
export const transformApiData = (apiData) => {
    const transformed = {};

    for (const nodeId in apiData) {
        const readings = apiData[nodeId];
        if (!Array.isArray(readings) || readings.length === 0) continue;

        const isSoilNode = readings[0].environment_metrics.soil_temperature_j1 !== undefined;
        const isWeatherNode = readings[0].environment_metrics.air_temperature !== undefined;

        if (isSoilNode) {
            for (let i = 1; i <= 3; i++) {
                const tempKey = `soil_temperature_j${i}`;
                const moistKey = `soil_moisture_j${i}`;
                
                const tempSeries = readings.map(r => ({ x: r.timestamp, y: r.environment_metrics[tempKey] })).filter(p => p.y != null);
                const moistSeries = readings.map(r => ({ x: r.timestamp, y: r.environment_metrics[moistKey] })).filter(p => p.y != null);

                if (tempSeries.length > 0) transformed[`${nodeId}-${i-1}-temperature`] = tempSeries;
                if (moistSeries.length > 0) transformed[`${nodeId}-${i-1}-moisture`] = moistSeries;
            }
        } else if (isWeatherNode) {
            const airTempSeries = readings.map(r => ({ x: r.timestamp, y: r.environment_metrics.air_temperature })).filter(p => p.y != null);
            const airHumidSeries = readings.map(r => ({ x: r.timestamp, y: r.environment_metrics.air_humidity })).filter(p => p.y != null);
            if (airTempSeries.length > 0) transformed.airTemperature = airTempSeries;
            if (airHumidSeries.length > 0) transformed.airHumidity = airHumidSeries;
        }
    }
    return transformed;
};
