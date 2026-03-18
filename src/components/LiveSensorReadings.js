import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import BedCard from './BedCard';
import WeatherCard from './WeatherCard';
import PaxCard from './PaxCard';
import { BED_MAPPING } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

function LiveSensorReadings() {
    const { t } = useTranslation();
    
    // Local state for live data
    const [latestReadings, setLatestReadings] = useState({});
    const [windData, setWindData] = useState({ latest: {}, direction: [] });
    const [paxData, setPaxData] = useState({ wifi: null, ble: null, lastUpdated: null });
    
    // Status state
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isPortalMode, setIsPortalMode] = useState(false);
    
    // Ref for polling interval to clear it on unmount
    const pollInterval = useRef(null);

    // Reverted to standard pattern matching SensorContext
    const API_URL = process.env.REACT_APP_PI_API_URL || '/api';

    const processLiveData = useCallback((data) => {
        const newLatestReadings = {};
        const newWindData = { latest: {}, direction: [] };
        const newPaxData = { wifi: null, ble: null, lastUpdated: null };

        // Helper to get the most recent record that actually contains relevant data
        // This prevents boxes from disappearing when a device sends a heartbeat/telemetry packet
        // (like battery voltage) without sensor readings.
        const getLatestWithData = (records, keysToCheck) => {
            if (!Array.isArray(records) || records.length === 0) return null;
            
            // Search backwards from newest to oldest
            for (let i = records.length - 1; i >= 0; i--) {
                const record = records[i];
                const env = record.environment_metrics || {};
                const pax = record.pax_metrics || {};
                
                // Check if any of the target keys exist and are valid in this record
                const hasData = keysToCheck.some(key => 
                    (env[key] !== undefined && env[key] !== null) || 
                    (pax[key] !== undefined && pax[key] !== null)
                );
                
                if (hasData) return record;
            }
            return null;
        };

        // 1. Process Weather Station (!c467c5cc)
        const weatherNode = data['!c467c5cc'];
        const latestWeather = getLatestWithData(weatherNode, ['wind_speed', 'air_temperature', 'air_humidity', 'wind_gust']);
        
        if (latestWeather && latestWeather.environment_metrics) {
            const env = latestWeather.environment_metrics;
            const ts = new Date(latestWeather.timestamp);

            newWindData.latest = {
                wind_speed: env.wind_speed,
                wind_gust: env.wind_gust,
                wind_direction: env.wind_direction,
                air_temperature: env.air_temperature,
                air_humidity: env.air_humidity,
                timestamp: ts
            };
            
            // For compass history (just one point for live view is fine)
            if (env.wind_direction !== undefined) {
                newWindData.direction = [{ x: ts, y: env.wind_direction }];
            }
        }

        // 2. Process PAX (!1641e779)
        const paxNode = data['!1641e779'];
        const latestPax = getLatestWithData(paxNode, ['wifi', 'ble', 'wifi_count', 'ble_count']);
        
        if (latestPax) {
            // Check both metric locations just in case
            const paxMetrics = latestPax.pax_metrics || latestPax.environment_metrics || {};
            if (paxMetrics.wifi !== undefined || paxMetrics.ble !== undefined) {
                newPaxData.wifi = paxMetrics.wifi;
                newPaxData.ble = paxMetrics.ble;
                newPaxData.lastUpdated = new Date(latestPax.timestamp);
            }
        }

        // 3. Process Soil Sensors using BED_MAPPING
        // The keys in BED_MAPPING are in format "nodeId-index" (e.g., "!04c5ad60-0")
        Object.keys(BED_MAPPING).forEach(bedKey => {
            // Split key to get node ID and index
            // Indices in mapping are 0-based, API uses 1-based (j1, j2...)
            const lastDashIndex = bedKey.lastIndexOf('-');
            const nodeId = bedKey.substring(0, lastDashIndex);
            const sensorIndex = parseInt(bedKey.substring(lastDashIndex + 1), 10);

            // Map index 0 -> j1, 1 -> j2, etc.
            const apiIndex = sensorIndex + 1;
            const moistureKey = `soil_moisture_j${apiIndex}`;
            const tempKey = `soil_temperature_j${apiIndex}`;

            const nodeData = data[nodeId];
            const latest = getLatestWithData(nodeData, [moistureKey, tempKey]);

            if (!latest || !latest.environment_metrics) return;

            const env = latest.environment_metrics;
            const ts = new Date(latest.timestamp);

            if (env[moistureKey] !== undefined || env[tempKey] !== undefined) {
                newLatestReadings[bedKey] = {
                    moisture: env[moistureKey],
                    temperature: env[tempKey],
                    timestamp: ts
                };
            }
        });

        // Add air readings to a generic 'air' key for any components that might look for it
        if (newWindData.latest.air_temperature !== undefined) {
            newLatestReadings.air = {
                airTemperature: newWindData.latest.air_temperature,
                airHumidity: newWindData.latest.air_humidity,
                timestamp: newWindData.latest.timestamp
            };
        }

        setLatestReadings(newLatestReadings);
        setWindData(newWindData);
        setPaxData(newPaxData);
    }, []);

    const fetchLiveData = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/telemetry/live`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            processLiveData(data);
            setLastUpdated(new Date());
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching live data:", error);
            setIsLoading(false);
        }
    }, [API_URL, processLiveData]);

    useEffect(() => {
        // Initial fetch
        fetchLiveData();

        // Poll every 60 seconds
        pollInterval.current = setInterval(fetchLiveData, 60000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [fetchLiveData]);

    // Listen for global escape key to close portal mode
    useEffect(() => {
        const closePortalHandler = () => {
            if (isPortalMode) {
                setIsPortalMode(false);
            }
        };

        window.addEventListener('closePortalMode', closePortalHandler);
        return () => {
            window.removeEventListener('closePortalMode', closePortalHandler);
        };
    }, [isPortalMode]);

    const togglePortalMode = () => {
        setIsPortalMode(!isPortalMode);
    };

    // Check availability of data for rendering
    const hasWeatherData = (
        windData.latest.wind_speed !== undefined || 
        windData.latest.air_temperature !== undefined
    );

    const hasPaxData = (
        paxData.wifi !== null || paxData.ble !== null
    );

    // Filter beds that have sensor data
    const bedsWithData = Object.entries(BED_MAPPING).filter(([bedId, bed]) => {
        const reading = latestReadings[bedId];
        return reading && (
            (reading.moisture !== null && reading.moisture !== undefined) ||
            (reading.temperature !== null && reading.temperature !== undefined)
        );
    });

    // Prepare weather data object for WeatherCard
    const combinedWeatherData = {
        latest: windData.latest,
        direction: windData.direction,
    };

    return (
        <div className="w-full h-full flex flex-col p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent live-sensor-readings-container">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="live-sensor-readings-icon">
                        <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-display text-xl lg:text-2xl live-sensor-readings-title">{t('sensorDataTitle')}</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${!lastUpdated ? 'bg-sunset live-sensor-readings-status-error' : 'bg-primary animate-pulse live-sensor-readings-status-success'}`}></div>
                        <span className={`text-xs font-medium ${!lastUpdated ? 'text-sunset' : 'text-text-primary'} live-sensor-readings-status-text`}>
                            {lastUpdated ? `${t('dataUpdated')} (${lastUpdated.toLocaleTimeString()})` : t('loading')}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={togglePortalMode}
                            className="flex items-center justify-center px-3 py-1.5 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 live-sensor-readings-button-accent"
                        >
                            {isPortalMode ? (
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={fetchLiveData}
                            disabled={isLoading}
                            className="flex items-center gap-1 px-3 py-1.5 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 live-sensor-readings-button-primary"
                        >
                            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                            </svg>
                            <span className="text-xs font-medium">{isLoading ? t('loading') : t('refreshData')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Weather and PAX Cards */}
            {(hasWeatherData || hasPaxData) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 flex-shrink-0">
                    {hasWeatherData && (
                        <div className={hasPaxData ? "sm:col-span-2" : "sm:col-span-2 lg:col-span-3"}>
                            <WeatherCard 
                                weatherData={combinedWeatherData} 
                                t={t} 
                            />
                        </div>
                    )}
                    {hasPaxData && (
                        <PaxCard paxData={paxData} t={t} />
                    )}
                </div>
            )}

            <div className="relative flex-grow flex flex-col min-h-0">
                {/* Portal overlay that appears when in portal mode */}
                <AnimatePresence>
                    {isPortalMode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Sensor boxes that fade out when in portal mode - Only show beds with data */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-grow min-h-0"
                    animate={{
                        opacity: isPortalMode ? 0 : 1,
                        scale: isPortalMode ? 0.95 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    {bedsWithData.map(([bedId, bed]) => (
                        <BedCard key={bedId} bed={bed} reading={latestReadings[bedId]} t={t} />
                    ))}
                </motion.div>

                {/* Show message when no beds have data */}
                {bedsWithData.length === 0 && !isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center text-text-muted">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="text-sm">{t('noSensorData')}</div>
                        </div>
                    </div>
                )}
            </div>

            {isLoading && !lastUpdated && (
                <div className="flex items-center justify-center flex-grow historical-graph-loading-container">
                    <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full mb-2 shadow-lg">
                            <svg className="w-5 h-5 text-white animate-spin historical-graph-loading-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                            </svg>
                        </div>
                        <div className="text-body text-text-muted historical-graph-loading-text">{t('loading')}...</div>
                        <div className="text-xs text-text-muted mt-1 historical-graph-loading-subtext">Pridobivam meritve</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LiveSensorReadings;
