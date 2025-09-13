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
            const response = await livadaApiClient.getHistoryTelemetry();
            
            // Check if response has data property
            const rawData = response.data || response;
            
            const transformedData = transformApiData(rawData);
            
            const processedHistory = {};
            for (const key in transformedData) {
                if (Array.isArray(transformedData[key])) {
                    processedHistory[key] = transformedData[key].map(point => ({
                        ...point,
                        x: new Date(point.x)
                    }));
                }
            }
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