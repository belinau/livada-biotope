import React, { useState, useEffect } from 'react';
import { useSensorData } from '../context/SensorContext';
import { useTranslation } from '../context/LanguageContext';
import BedCard from './BedCard';
import { AirHumidityWave, AirTemperatureWave } from './SensorGauges';
import { BED_MAPPING } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';

function LiveSensorReadings() {
    const { t } = useTranslation();
    const { history, status, lastUpdated, refreshData } = useSensorData();
    const [latestReadings, setLatestReadings] = useState({});
    const [isPortalMode, setIsPortalMode] = useState(false);

    useEffect(() => {
        if (!history) return;

        const newLatestReadings = {};
        for (const historyKey in history) {
            if (Array.isArray(history[historyKey]) && history[historyKey].length > 0) {
                const lastPoint = history[historyKey][history[historyKey].length - 1];
                
                // Extract bedId and metricType from the history key
                let bedId, metricType;
                if (historyKey.includes('-')) {
                    bedId = historyKey.substring(0, historyKey.lastIndexOf('-'));
                    metricType = historyKey.substring(historyKey.lastIndexOf('-') + 1);
                } else {
                    // For air temperature/humidity
                    bedId = 'air';
                    metricType = historyKey;
                }

                if (!newLatestReadings[bedId]) { newLatestReadings[bedId] = {}; } 
                newLatestReadings[bedId][metricType] = lastPoint.y;
                newLatestReadings[bedId].timestamp = lastPoint.x;
            }
        }
        setLatestReadings(newLatestReadings);
    }, [history]);

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

    const isLoading = status.key === 'loading';

    const getStatusMessage = () => {
        if (status.type === 'error') return t('fetchError');
        if (status.type === 'success') return `${t('dataUpdated')} (${lastUpdated?.toLocaleTimeString()})`;
        return `${t('loading')}...`;
    };
    
    const togglePortalMode = () => {
        setIsPortalMode(!isPortalMode);
    };

    // Get air readings
    const airReadings = latestReadings.air || {};

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
                        <div className={`w-2 h-2 rounded-full ${status.type === 'error' ? 'bg-sunset live-sensor-readings-status-error' : status.type === 'success' ? 'bg-primary animate-pulse live-sensor-readings-status-success' : 'bg-sunset'}`}></div>
                        <span className={`text-xs font-medium ${status.type === 'error' ? 'text-sunset' : 'text-text-primary'} live-sensor-readings-status-text`}>{getStatusMessage()}</span>
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
            </div>

            {/* Air Temperature and Humidity Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 flex-shrink-0">
                <GlassCard className="p-3 rounded-xl border border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm air-gauge-card">
                    <AirTemperatureWave 
                        value={airReadings.airTemperature} 
                        label={t('airTemp')} 
                        unit="°C" 
                        lastUpdated={airReadings.timestamp}
                    />
                </GlassCard>
                <GlassCard className="p-3 rounded-xl border border-[var(--glass-border)] bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm air-gauge-card">
                    <AirHumidityWave 
                        value={airReadings.airHumidity} 
                        label={t('airHumidity')} 
                        unit="%" 
                        lastUpdated={airReadings.timestamp}
                    />
                </GlassCard>
            </div>

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

                {/* Sensor boxes that fade out when in portal mode */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-grow min-h-0"
                    animate={{
                        opacity: isPortalMode ? 0 : 1,
                        scale: isPortalMode ? 0.95 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    {Object.entries(BED_MAPPING).map(([bedId, bed]) => (
                        <BedCard key={bedId} bed={bed} reading={latestReadings[bedId]} t={t} />
                    ))}
                </motion.div>
            </div>

            {isLoading && !history && (
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
