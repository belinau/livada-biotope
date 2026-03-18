import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import LivadaAPIClient from '../shared/api-client';
import { transformApiData } from '../shared/sensor-utils';

const SensorContext = createContext();
export const useSensorData = () => useContext(SensorContext);

export const SensorProvider = ({ children }) => {
    const [history, setHistory] = useState(null);
    const [status, setStatus] = useState({ key: 'loading', type: 'connecting' });
    const [lastUpdated, setLastUpdated] = useState(null);

    // Use environment variable in development, /api proxy in production
    const apiUrl = process.env.REACT_APP_PI_API_URL || '/api';
    const livadaApiClient = useMemo(() => new LivadaAPIClient(apiUrl), [apiUrl]);

    const fetchHistory = useCallback(async () => {
        setStatus({ key: 'loading', type: 'connecting' });
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 1); // Fetch last 24 hours for the main context
            const response = await livadaApiClient.getHistoryTelemetry(startDate, endDate, 'hourly');

            // Check if response has data property
            const rawData = response.data || response;

            // Debug: Log the raw API response to understand the data structure
            console.log('[SensorContext] Raw API response nodes:', Object.keys(rawData || {}));
            console.log('[SensorContext] Sample data for first node:', Object.entries(rawData || {}).slice(0, 2));

            const transformedData = transformApiData(rawData);

            // Debug: Log transformed data keys
            console.log('[SensorContext] Transformed data keys:', Object.keys(transformedData || {}));

            const processedHistory = {};
            for (const key in transformedData) {
                if (Array.isArray(transformedData[key])) {
                    processedHistory[key] = transformedData[key].map(point => ({
                        ...point,
                        x: new Date(point.x)
                    }));
                }
            }
            
            // Debug: Log processed history keys
            console.log('[SensorContext] Processed history keys:', Object.keys(processedHistory || {}));
            
            setHistory(processedHistory);
            setStatus({ key: 'dataUpdated', type: 'success' });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Could not fetch history:", error.message || error);
            setStatus({ key: 'fetchError', type: 'error' });
            setHistory({});
        }
    }, [livadaApiClient]);

    useEffect(() => {
        fetchHistory();
        const intervalId = setInterval(fetchHistory, 10 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchHistory]);

    return (
        <SensorContext.Provider value={{ history, status, lastUpdated, refreshData: fetchHistory }}>
            {children}
        </SensorContext.Provider>
    );
};