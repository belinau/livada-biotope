import React, { useState, useEffect } from 'react';
import { useSensorData } from '../context/SensorContext';
import { useTranslation } from '../context/LanguageContext';
import BedCard from './BedCard';
import { BED_MAPPING } from '../lib/constants';

function LiveSensorReadings() {
    const { t } = useTranslation();
    const { history, status, lastUpdated, refreshData } = useSensorData();
    const [latestReadings, setLatestReadings] = useState({});

    useEffect(() => {
        if (!history) return;

        const newLatestReadings = {};
        for (const historyKey in history) {
            if (Array.isArray(history[historyKey]) && history[historyKey].length > 0) {
                const lastPoint = history[historyKey][history[historyKey].length - 1];
                const bedId = historyKey.substring(0, historyKey.lastIndexOf('-'));
                const metricType = historyKey.substring(historyKey.lastIndexOf('-') + 1);

                if (!newLatestReadings[bedId]) { newLatestReadings[bedId] = {}; } 
                newLatestReadings[bedId][metricType] = lastPoint.y;
                newLatestReadings[bedId].timestamp = lastPoint.x;
            }
        }
        setLatestReadings(newLatestReadings);
    }, [history]);

    const isLoading = status.key === 'loading';

    const getStatusMessage = () => {
        if (status.type === 'error') return t('fetchError');
        if (status.type === 'success') return `${t('dataUpdated')} (${lastUpdated?.toLocaleTimeString()})`;
        return `${t('loading')}...`;
    };
    
    return (
        <div className="relative p-4 sm:p-8 rounded-2xl shadow-2xl overflow-hidden border border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-display text-2xl lg:text-3xl text-text-main bg-gradient-to-r from-primary-dark to-primary-dark bg-clip-text text-transparent">{t('sensorDataTitle')}</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status.type === 'error' ? 'bg-sunset' : status.type === 'success' ? 'bg-primary animate-pulse' : 'bg-sunset'}`}></div>
                        <span className={`text-accent font-medium ${status.type === 'error' ? 'text-sunset' : 'text-text-main'}`}>{getStatusMessage()}</span>
                    </div>
                    <button
                        onClick={refreshData}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                        <span className="text-accent font-medium">{isLoading ? t('loading') : t('refreshData')}</span>
                    </button>
                </div>
            </div>

            {isLoading && !history ? (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                    </div>
                    <div className="text-body-lg text-text-muted">{t('loading')}...</div>
                    <div className="text-accent text-text-muted mt-2">Pridobivam podatke senzorjev</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(BED_MAPPING).map(([bedId, bed]) => (
                        <BedCard key={bedId} bed={bed} reading={latestReadings[bedId]} t={t} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LiveSensorReadings;
