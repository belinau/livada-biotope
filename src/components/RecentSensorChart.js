import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTranslation } from '../context/LanguageContext';
import { useSensorData } from '../context/SensorContext';
import BedCard from './BedCard';
import { GlassCard } from './ui/GlassCard';
import { BED_MAPPING } from '../lib/constants';

export const ChartWrapper = ({ title, children }) => (
    <GlassCard className="flex flex-col min-h-[400px]" padding="p-4 sm:p-6" rounded="xl">
        <div className="flex items-center justify-center mb-4">
            <h4 className="heading-playful text-lg text-center px-4 py-2 bg-gradient-to-r from-bg-main to-bg-main rounded-full border border-border-color shadow-sm">{title}</h4>
        </div>
        <div className="flex-grow relative overflow-hidden">{children}</div>
    </GlassCard>
);

function RecentSensorChart() {
    const { t, language } = useTranslation();
    const { history, status, lastUpdated, refreshData } = useSensorData();
    const [chartData, setChartData] = useState({ moisture: [], temperature: [] });
    const [latestReadings, setLatestReadings] = useState({});

    const nivoTheme = useMemo(() => {
        if (typeof window === 'undefined') return {};
        const style = getComputedStyle(document.documentElement);
        return {
            axis: {
                ticks: { text: { fill: style.getPropertyValue('--text-muted') } },
                legend: { text: { fill: style.getPropertyValue('--text-main'), fontSize: 'var(--text-sm)' } }
            },
            grid: { line: { stroke: style.getPropertyValue('--border-color'), strokeDasharray: '2 2' } },
            tooltip: { container: { background: style.getPropertyValue('--bg-main'), color: style.getPropertyValue('--text-main'), border: `1px solid ${style.getPropertyValue('--border-color')}` } },
        };
    }, []);

    const CustomTooltip = ({ point }) => {
        const date = new Date(point.data.x);
        const formattedDate = date.toLocaleString(language, {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        return (
            <div className="bg-bg-main p-3 border border-border-color rounded-sm shadow-lg">
                <div className="flex items-center">
                    <span style={{ display: 'block', width: '12px', height: '12px', background: point.serieColor, marginRight: '8px' }}></span>
                    <strong className="text-text-main">{point.serieId}</strong>
                </div>
                <div className="text-text-muted">{formattedDate}</div>
                <div className="text-text-main">{`${point.data.yFormatted}`}</div>
            </div>
        );
    };

    useEffect(() => {
        if (!history) return;

        const newChartData = { moisture: [], temperature: [] };
        const newLatestReadings = {};
        const processDataPoint = (item) => ({ x: new Date(item.x), y: typeof item.y === 'number' && !isNaN(item.y) ? item.y : 0 });

        for (const historyKey in history) {
            if (Array.isArray(history[historyKey]) && history[historyKey].length > 0) {
                const seriesData = history[historyKey].map(processDataPoint);
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

                // For soil sensors
                if (bedId !== 'air') {
                    const bedInfo = BED_MAPPING[bedId];
                    if (bedInfo) {
                        if (metricType === 'moisture') newChartData.moisture.push({ id: bedInfo.name, color: bedInfo.color, data: seriesData });
                        else if (metricType === 'temperature') newChartData.temperature.push({ id: bedInfo.name, color: bedInfo.color, data: seriesData });
                    }
                }
            }
        }
        
        // Handle air humidity and temperature
        if (history.airHumidity?.length > 0) {
            newChartData.moisture.push({ id: t('airHumidity'), color: '#76e4f7', data: history.airHumidity.map(processDataPoint) });
        }
        if (history.airTemperature?.length > 0) {
            newChartData.temperature.push({ id: t('airTemp'), color: '#f6ad55', data: history.airTemperature.map(processDataPoint) });
        }

        setChartData(newChartData);
        setLatestReadings(newLatestReadings);
    }, [history, t]);

    const hasMoistureData = chartData.moisture.some(series => series.data.length > 1);
    const hasTemperatureData = chartData.temperature.some(series => series.data.length > 1);
    const isLoading = status.key === 'loading';

    const getStatusMessage = () => {
        if (status.type === 'error') return t('fetchError');
        if (status.type === 'success') return `${t('dataUpdated')} (${lastUpdated?.toLocaleTimeString()})`;
        return `${t('loading')}...`;
    };
    
    return (
        <div className="relative">
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
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {Object.entries(BED_MAPPING).map(([bedId, bed]) => (
                            <BedCard key={bedId} bed={bed} reading={latestReadings[bedId]} t={t} />
                        ))}
                    </div>

                    <div className="space-y-8 pt-8 border-t-2 border-border-color">
                        <div className="text-center">
                            <h4 className="heading-organic text-xl mb-3">Grafični prikaz podatkov</h4>
                            <p className="text-body text-text-muted">Spremljanje vlage in temperature skozi čas</p>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <ChartWrapper title={t('moistureFlows')}> 
                                {hasMoistureData ? (
                                    <ResponsiveLine
                                        tooltip={CustomTooltip}
                                        data={chartData.moisture}
                                        theme={nivoTheme}
                                        colors={{ datum: 'color' }}
                                        margin={{ top: 20, right: 30, bottom: 140, left: 80 }}
                                        xScale={{ type: 'time', format: 'native' }}
                                        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                                        axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40, legendPosition: 'middle' }}
                                        axisLeft={{ legend: 'Vlaga (%)', legendOffset: -60, legendPosition: 'middle' }}
                                        enablePoints={false}
                                        useMesh={true}
                                        curve="monotoneX"
                                        animate={true}
                                        motionConfig="wobbly"
                                        legends={[{ 
                                            anchor: 'bottom',
                                            direction: 'row',
                                            justify: false,
                                            translateX: 0,
                                            translateY: 100,
                                            itemsSpacing: 8,
                                            itemWidth: 140,
                                            itemHeight: 20,
                                            symbolSize: 14,
                                            itemTextColor: 'var(--text-main)'
                                        }]}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-text-muted bg-bg-main/50 rounded-lg border-2 border-dashed border-border-color">
                                        <div className="text-center p-8">
                                            <div className="text-4xl mb-3">📈</div>
                                            <div className="text-body font-medium">{t('noChartData')}</div>
                                            <div className="text-accent text-text-muted mt-2">Podatki se bodo prikazali, ko bodo na voljo</div>
                                        </div>
                                    </div>
                                )}
                            </ChartWrapper>
                            <ChartWrapper title={t('temperatureFlows')}> 
                                {hasTemperatureData ? (
                                    <ResponsiveLine
                                        tooltip={CustomTooltip}
                                        data={chartData.temperature}
                                        theme={nivoTheme}
                                        colors={{ datum: 'color' }}
                                        margin={{ top: 20, right: 30, bottom: 140, left: 80 }}
                                        xScale={{ type: 'time', format: 'native' }}
                                        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                                        axisBottom={{ format: '%H:%M', tickValues: 5, legend: t('time'), legendOffset: 40, legendPosition: 'middle' }}
                                        axisLeft={{ legend: `${t('temperature')} (°C)`, legendOffset: -60, legendPosition: 'middle' }}
                                        enablePoints={false}
                                        useMesh={true}
                                        curve="monotoneX"
                                        animate={true}
                                        motionConfig="wobbly"
                                        legends={[{ 
                                            anchor: 'bottom',
                                            direction: 'row',
                                            justify: false,
                                            translateX: 0,
                                            translateY: 100,
                                            itemsSpacing: 8,
                                            itemWidth: 140,
                                            itemHeight: 20,
                                            symbolSize: 14,
                                            itemTextColor: 'var(--text-main)'
                                        }]}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-text-muted bg-bg-main/50 rounded-lg border-2 border-dashed border-border-color">
                                        <div className="text-center p-8">
                                            <div className="text-4xl mb-3">🌡️</div>
                                            <div className="text-body font-medium">{t('noChartData')}</div>
                                            <div className="text-accent text-text-muted mt-2">Podatki se bodo prikazali, ko bodo na voljo</div>
                                        </div>
                                    </div>
                                )}
                            </ChartWrapper>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default RecentSensorChart;
