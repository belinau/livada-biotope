import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { BED_MAPPING } from '../lib/constants';
import { SENSOR_COLORS } from '../lib/sensor-colors';
import LivadaAPIClient from '../shared/api-client';
import { transformApiData } from '../shared/sensor-utils';
import EnhancedHistoricalGraphWithZoom from './EnhancedHistoricalGraphWithZoom';
import DateRangeControls from './DateRangeControls'; // Import DateRangeControls

// Define HistoricalSensorContext and HistoricalSensorProvider here
const HistoricalSensorContext = createContext();

const HistoricalSensorProvider = ({ children }) => {
    const initialEndDate = new Date();
    const initialStartDate = new Date();
    initialStartDate.setDate(initialEndDate.getDate() - 7);

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const handleDateChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const [sensorHistory, setSensorHistory] = useState(null);
    const [status, setStatus] = useState({ key: 'loading', type: 'connecting' });
    const [lastUpdated, setLastUpdated] = useState(null);
    const [granularity, setGranularity] = useState('daily');

    // Use environment variable in development, /api proxy in production
    const apiUrl = process.env.REACT_APP_PI_API_URL || '/api';
    const livadaApiClient = useMemo(() => new LivadaAPIClient(apiUrl), [apiUrl]);

    const fetchLongTermHistory = useCallback(async () => {
        setStatus({ key: 'loading', type: 'connecting' });
        try {
            const response = await livadaApiClient.getHistoryTelemetry(startDate, endDate);
            
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
            setSensorHistory(processedHistory);
            setStatus({ key: 'dataUpdated', type: 'success' });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Could not fetch long term history:", error.message || error);
            setStatus({ key: 'fetchError', type: 'error' });
            setSensorHistory({});
        }
    }, [startDate, endDate, livadaApiClient]);

    useEffect(() => {
        fetchLongTermHistory();
    }, [fetchLongTermHistory]);

    return (
        <HistoricalSensorContext.Provider value={{ 
            history: sensorHistory, 
            status, 
            lastUpdated, 
            refreshData: fetchLongTermHistory,
            startDate,
            endDate,
            onDateChange: handleDateChange,
            granularity,
            setGranularity
        }}>
            {children}
        </HistoricalSensorContext.Provider>
    );
};

const HistoricalSensorContent = () => {
    const { t } = useTranslation();
    const { 
        status, 
        lastUpdated, 
        refreshData, 
        granularity,
        setGranularity,
        startDate,
        endDate,
        onDateChange
    } = useContext(HistoricalSensorContext);
    
    const [visibleMetrics, setVisibleMetrics] = useState({
        moisture: true,
        temperature: true,
        airHumidity: true,
        airTemperature: true
    });

    // Initialize visible beds with all beds visible
    const [visibleBeds, setVisibleBeds] = useState(() => {
        const bedState = {};
        Object.keys(BED_MAPPING).forEach(bedId => {
            bedState[bedId] = true;
        });
        return bedState;
    });

    const isLoading = status.key === 'loading';

    const getStatusMessage = () => {
        if (status.type === 'error') return t('fetchError');
        if (status.type === 'success') return `${t('dataUpdated')} (${lastUpdated?.toLocaleTimeString()})`;
        return `${t('loading')}...`;
    };
    
    // Toggle metric visibility
    const toggleMetric = (metric) => {
        setVisibleMetrics(prev => ({
            ...prev,
            [metric]: !prev[metric]
        }));
    };

    // Toggle bed visibility
    const toggleBed = (bedId) => {
        setVisibleBeds(prev => ({
            ...prev,
            [bedId]: !prev[bedId]
        }));
    };

    // Toggle all beds visibility
    const toggleAllBeds = () => {
        const allVisible = Object.values(visibleBeds).every(visible => visible);
        const newVisibleBeds = {};
        Object.keys(visibleBeds).forEach(bedId => {
            newVisibleBeds[bedId] = !allVisible;
        });
        setVisibleBeds(newVisibleBeds);
    };

    return (
        <div className="relative p-0 sm:p-0 rounded-2xl shadow-2xl overflow-hidden border-0 bg-transparent">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="live-sensor-readings-icon">
                        <svg className="w-6 h-6 icon-primary-stroke" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-display text-2xl lg:text-3xl live-sensor-readings-title">{t('historicalSensorDataTitle')}</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status.type === 'error' ? 'bg-sunset' : status.type === 'success' ? 'bg-primary animate-pulse' : 'bg-sunset'}`}></div>
                        <span className={`text-accent font-medium ${status.type === 'error' ? 'text-sunset' : 'text-text-main'}`}>{getStatusMessage()}</span>
                    </div>
                    <button
                        onClick={refreshData}
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

            <div className="mb-6">
                <DateRangeControls
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={onDateChange}
                    granularity={granularity}
                    onGranularityChange={setGranularity}
                />
            </div>

            {/* Unified Filter Panel */}
            <div className="mt-6">
                <div className="p-4 rounded-xl border border-[var(--glass-border)] backdrop-blur-sm w-full bg-[var(--glass-bg)]">
                    {/* Metric Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--glass-border)]">
                        <h4 className="text-text-main font-medium text-sm">{t('metrics')}:</h4>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setVisibleMetrics(prev => {
                                    const allVisible = Object.values(prev).every(visible => visible);
                                    return {
                                        moisture: !allVisible,
                                        temperature: !allVisible,
                                        airHumidity: !allVisible,
                                        airTemperature: !allVisible
                                    };
                                })}
                                className="px-3 py-1.5 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] text-xs shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                {Object.values(visibleMetrics).every(visible => visible) ? t('hideAll') : t('showAll')}
                            </button>
                            {[
                                { id: 'moisture', label: t('soilMoisture'), color: SENSOR_COLORS.moisture.line },
                                { id: 'temperature', label: t('soilTemp'), color: SENSOR_COLORS.temperature.line },
                                { id: 'airHumidity', label: t('airHumidity'), color: SENSOR_COLORS.airHumidity.line },
                                { id: 'airTemperature', label: t('airTemp'), color: SENSOR_COLORS.airTemperature.line }
                            ].map((metric) => (
                                <button
                                    key={metric.id}
                                    onClick={() => toggleMetric(metric.id)}
                                    className={`px-3 py-1.5 font-medium rounded-lg transition-all duration-300 border text-xs shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105 ${
                                        visibleMetrics[metric.id]
                                            ? 'bg-gradient-to-r from-primary to-primary-light text-white border-primary'
                                            : 'bg-[var(--glass-bg-nav)] text-text-main border-[var(--glass-border)] hover:bg-primary/30'
                                    }`}
                                    style={{
                                        background: visibleMetrics[metric.id] 
                                            ? `linear-gradient(135deg, ${metric.color}, ${metric.color}dd)` 
                                            : undefined
                                    }}
                                >
                                    <span 
                                        className="w-2 h-2 rounded-full"
                                        style={{ 
                                            backgroundColor: visibleMetrics[metric.id] ? 'white' : metric.color,
                                            opacity: visibleMetrics[metric.id] ? 1 : 0.7
                                        }}
                                    ></span>
                                    {metric.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Bed Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3">
                        <h4 className="text-text-main font-medium text-sm">{t('bedFilters')}:</h4>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={toggleAllBeds}
                                className="px-3 py-1.5 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] text-xs shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                {Object.values(visibleBeds).every(visible => visible) ? t('hideAll') : t('showAll')}
                            </button>
                            {Object.entries(BED_MAPPING).map(([bedId, bed]) => (
                                <button
                                    key={bedId}
                                    onClick={() => toggleBed(bedId)}
                                    className={`px-3 py-1.5 font-medium rounded-lg transition-all duration-300 border text-xs shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105 ${
                                        visibleBeds[bedId]
                                            ? 'bg-gradient-to-r from-primary to-primary-light text-white border-primary'
                                            : 'bg-[var(--glass-bg-nav)] text-text-main border-[var(--glass-border)] hover:bg-primary/30'
                                    }`}
                                    style={{
                                        background: visibleBeds[bedId] 
                                            ? `linear-gradient(135deg, ${bed.color}, ${bed.color}dd)` 
                                            : undefined
                                    }}
                                >
                                    <span 
                                        className="w-2 h-2 rounded-full"
                                        style={{ 
                                            backgroundColor: visibleBeds[bedId] ? 'white' : bed.color,
                                            opacity: visibleBeds[bedId] ? 1 : 0.7
                                        }}
                                    ></span>
                                    {t(bed.name) || bed.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Historical Graph */}
            <div>
                <div className="border-t-2 border-[var(--glass-border)] rounded-2xl overflow-hidden">
                    <EnhancedHistoricalGraphWithZoom 
                        visibleMetrics={visibleMetrics}
                        visibleBeds={visibleBeds}
                        granularity={granularity}
                        onGranularityChange={setGranularity}
                        onRefreshData={refreshData}
                        isLoading={isLoading} // Pass isLoading prop
                    />
                </div>
            </div>
        </div>
    );
};

export default function EnhancedHistoricalVisualization() {
    return (
        <HistoricalSensorProvider>
            <HistoricalSensorContent />
        </HistoricalSensorProvider>
    );
}

export { HistoricalSensorContext };
