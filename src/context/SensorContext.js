import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import pLimit from 'p-limit';
import LivadaAPIClient from '../shared/api-client';
import { transformApiData } from '../shared/sensor-utils';

const limit = pLimit(2); // Limit to 2 concurrent requests

const SensorContext = createContext();
export const useSensorData = () => useContext(SensorContext);

export const SensorProvider = ({ children }) => {
    const [history, setHistory] = useState(null);
    const [status, setStatus] = useState({ key: 'loading', type: 'connecting' });
    const [lastUpdated, setLastUpdated] = useState(null);

    const livadaApiClient = useMemo(() => new LivadaAPIClient(process.env.REACT_APP_PI_API_URL), []);

    const fetchHistory = useCallback(async () => {
        setStatus({ key: 'loading', type: 'connecting' });
        try {
            const data = await livadaApiClient.getHistoryTelemetry();
            const transformedData = transformApiData(data.data);
            
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