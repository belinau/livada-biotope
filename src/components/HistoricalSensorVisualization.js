import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTranslation, BED_MAPPING, ChartWrapper } from '../App';
import LivadaAPIClient from '../shared/api-client';
import { transformApiData } from '../shared/sensor-utils';

// Define HistoricalSensorContext and HistoricalSensorProvider here
const HistoricalSensorContext = createContext();

const HistoricalSensorProvider = ({ children, startDate, endDate, onDateChange }) => {
    const [history, setHistory] = useState(null);
    const [status, setStatus] = useState({ key: 'loading', type: 'connecting' });
    const [lastUpdated, setLastUpdated] = useState(null);

    const livadaApiClient = useMemo(() => new LivadaAPIClient(process.env.REACT_APP_PI_API_URL), []);

    const fetchLongTermHistory = useCallback(async () => {
        setStatus({ key: 'loading', type: 'connecting' });
        try {
            const data = await livadaApiClient.getHistoryTelemetry(startDate, endDate);
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
            console.error("Could not fetch long term history:", error);
            setStatus({ key: 'fetchError', type: 'error' });
            setHistory({});
        }
    }, [startDate, endDate, livadaApiClient]);

    useEffect(() => {
        fetchLongTermHistory();
    }, [fetchLongTermHistory]);

    return (
        <HistoricalSensorContext.Provider value={{ 
            history, 
            status, 
            lastUpdated, 
            refreshData: fetchLongTermHistory,
            startDate,
            endDate,
            onDateChange
        }}>
            {children}
        </HistoricalSensorContext.Provider>
    );
};

const HistoricalSensorContent = () => {
    const { t, language } = useTranslation();
    const { history, status, lastUpdated, refreshData, startDate, endDate, onDateChange } = useContext(HistoricalSensorContext);
    const [chartData, setChartData] = useState({ moisture: [], temperature: [] });

    // Calculate the actual date difference
    const dateDiff = useMemo(() => {
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);

    const tickValues = useMemo(() => {
        if (dateDiff <= 7) return 'every 12 hours';
        if (dateDiff <= 30) return 'every 2 days';
        return 'every 7 days';
    }, [dateDiff]);

    const nivoTheme = {
        axis: { ticks: { text: { fill: '#333' } }, legend: { text: { fill: '#333', fontSize: 14 } } },
        grid: { line: { stroke: '#e0e0e0', strokeDasharray: '2 2' } },
        tooltip: { container: { background: 'white', color: '#333', border: '1px solid #ccc' } },
    };

    const CustomTooltip = ({ point }) => {
        const date = new Date(point.data.x);
        const formattedDate = date.toLocaleString(language, {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        return (
            <div style={{ background: 'white', padding: '9px 12px', border: '1px solid #ccc', borderRadius: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'block', width: '12px', height: '12px', background: point.serieColor, marginRight: '8px' }}></span>
                    <strong>{point.serieId}</strong>
                </div>
                <div>{formattedDate}</div>
                <div>{`${point.data.yFormatted}`}</div>
            </div>
        );
    };

    // Handle date changes
    const handleStartDateChange = (newDate) => {
        onDateChange(newDate, endDate);
    };

    const handleEndDateChange = (newDate) => {
        onDateChange(startDate, newDate);
    };

    useEffect(() => {
        if (!history) return;

        const newChartData = { moisture: [], temperature: [] };
        const processDataPoint = (item) => ({ x: new Date(item.x), y: typeof item.y === 'number' && !isNaN(item.y) ? item.y : 0 });

        for (const historyKey in history) {
            if (Array.isArray(history[historyKey]) && history[historyKey].length > 0) {
                const seriesData = history[historyKey].map(processDataPoint);
                const bedId = historyKey.substring(0, historyKey.lastIndexOf('-'));
                const metricType = historyKey.substring(historyKey.lastIndexOf('-') + 1);

                const bedInfo = BED_MAPPING[bedId];
                if (bedInfo) {
                    if (metricType === 'moisture') newChartData.moisture.push({ id: bedInfo.name, color: bedInfo.color, data: seriesData });
                    else if (metricType === 'temperature') newChartData.temperature.push({ id: bedInfo.name, color: bedInfo.color, data: seriesData });
                }
            }
        }
        
        if (history.airHumidity?.length > 0) newChartData.moisture.push({ id: t('airHumidity'), color: '#76e4f7', data: history.airHumidity.map(processDataPoint) });
        if (history.airTemperature?.length > 0) newChartData.temperature.push({ id: t('airTemp'), color: '#f6ad55', data: history.airTemperature.map(processDataPoint) });

        setChartData(newChartData);
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
        <div className="relative p-4 sm:p-8 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 bg-gradient-to-br from-blue-50/90 to-white/80 backdrop-blur-sm mt-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">{t('historicalSensorDataTitle')}</h3>
                </div>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                        <div className="flex items-center gap-2">
                            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Od:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate.toISOString().split('T')[0]}
                                onChange={(e) => handleStartDateChange(new Date(e.target.value))}
                                className="p-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">Do:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate.toISOString().split('T')[0]}
                                onChange={(e) => handleEndDateChange(new Date(e.target.value))}
                                className="p-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">({dateDiff} dni)</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${status.type === 'error' ? 'bg-red-500' : status.type === 'success' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                            <span className={`text-sm font-medium ${status.type === 'error' ? 'text-red-600' : 'text-gray-700'}`}>{getStatusMessage()}</span>
                        </div>
                        <button
                            onClick={refreshData}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                            </svg>
                            <span>{isLoading ? t('loading') : t('refreshData')}</span>
                        </button>
                    </div>
                </div>
            </div>
            {isLoading && !history ? (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                    </div>
                    <div className="text-lg font-medium text-gray-600">{t('loading')}...</div>
                    <div className="text-sm text-gray-500 mt-2">Pridobivam zgodovinske podatke</div>
                </div>
            ) : (
                <div className="space-y-8 pt-8 border-t-2 border-gray-200">
                    <div className="text-center">
                        <h4 className="heading-organic text-xl mb-2">Zgodovinski grafični prikaz</h4>
                        <p className="text-body text-gray-600">Dolžji pregled podatkov senzorjev za izbrano obdobje</p>
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
                                    axisBottom={{ format: '%b %d', tickValues: tickValues, legend: t('time'), legendOffset: 40, legendPosition: 'middle' }}
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
                                        itemTextColor: '#333'
                                    }]}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                                    <div className="text-center p-8">
                                        <div className="text-4xl mb-3">📈</div>
                                        <div className="font-medium">{t('noChartData')}</div>
                                        <div className="text-sm text-gray-400 mt-2">Podatki se bodo prikazali, ko bodo na voljo</div>
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
                                    axisBottom={{ format: '%b %d', tickValues: tickValues, legend: t('time'), legendOffset: 40, legendPosition: 'middle' }}
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
                                        itemTextColor: '#333'
                                    }]}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                                    <div className="text-center p-8">
                                        <div className="text-4xl mb-3">🌡️</div>
                                        <div className="font-medium">{t('noChartData')}</div>
                                        <div className="text-sm text-gray-400 mt-2">Podatki se bodo prikazali, ko bodo na voljo</div>
                                    </div>
                                </div>
                            )}
                        </ChartWrapper>
                    </div>
                </div>
            )} 
        </div>
    );
};

export default function HistoricalSensorVisualization() {
    // Initialize startDate to 30 days ago and endDate to today
    const initialEndDate = new Date();
    const initialStartDate = new Date();
    initialStartDate.setDate(initialEndDate.getDate() - 30);

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    // Handle date changes from child components
    const handleDateChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    return (
        <HistoricalSensorProvider 
            startDate={startDate} 
            endDate={endDate} 
            onDateChange={handleDateChange}
        >
            <HistoricalSensorContent />
        </HistoricalSensorProvider>
    );
}
