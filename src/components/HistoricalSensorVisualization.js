
import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTranslation, BED_MAPPING, ChartWrapper } from '../App';
import LivadaAPIClient from '../shared/api-client';
import { transformApiData } from '../shared/sensor-utils';

// Define HistoricalSensorContext and HistoricalSensorProvider here
const HistoricalSensorContext = createContext();

const HistoricalSensorProvider = ({ children, startDate, endDate }) => {
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
        <HistoricalSensorContext.Provider value={{ history, status, lastUpdated, refreshData: fetchLongTermHistory }}>
            {children}
        </HistoricalSensorContext.Provider>
    );
};

export default function HistoricalSensorVisualization() {
    const { t, language } = useTranslation();
    // Initialize startDate to 30 days ago and endDate to today
    const initialEndDate = new Date();
    const initialStartDate = new Date();
    initialStartDate.setDate(initialEndDate.getDate() - 30);

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const dateDiff = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));

    const tickValues = useMemo(() => {
        if (dateDiff <= 7) return 'every 12 hours';
        if (dateDiff <= 30) return 'every 2 days';
        return 'every 7 days';
    }, [dateDiff]);

    const { history, status, lastUpdated, refreshData } = useContext(HistoricalSensorContext);
    const [chartData, setChartData] = useState({ moisture: [], temperature: [] });

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
        <HistoricalSensorProvider startDate={startDate} endDate={endDate}>
            <div className="relative p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden border border-gray-200 bg-gray-50/80 backdrop-blur-sm mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 flex-wrap">
                    <h3 className="text-2xl font-mono text-primary"> {t('historicalSensorDataTitle')} </h3>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="startDate" className="text-sm text-gray-600">From:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate.toISOString().split('T')[0]}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                className="p-2 border border-gray-300 rounded-md text-sm"
                            />
                            <label htmlFor="endDate" className="text-sm text-gray-600">To:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate.toISOString().split('T')[0]}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                className="p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                        <span className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-gray-600'}`}>{getStatusMessage()}</span>
                        <button onClick={refreshData} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                            </svg>
                            <span>{isLoading ? t('loading') : t('refreshData')}</span>
                        </button>
                    </div>

                    {isLoading && !history ? (
                         <div className="text-center py-20 text-gray-500">{t('loading')}...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-8 pt-6 border-t">
                                <ChartWrapper title={t('moistureFlows')}>
                                    {hasMoistureData ? (
                                        <ResponsiveLine tooltip={CustomTooltip} data={chartData.moisture} theme={nivoTheme} colors={{ datum: 'color' }} margin={{ top: 10, right: 20, bottom: 120, left: 70 }} xScale={{ type: 'time', format: 'native' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }} axisBottom={{ format: '%b %d', tickValues: tickValues, legend: t('time'), legendOffset: 40 }} axisLeft={{ legend: 'Vlaga (%)', legendOffset: -50 }} enablePoints={false} useMesh={true} curve="monotoneX" legends={[{ anchor: 'bottom', direction: 'row', justify: false, translateX: 0, translateY: 80, itemsSpacing: 4, itemWidth: 180, itemHeight: 20, symbolSize: 12, itemTextColor: '#333' }]} />
                                    ) : ( <div className="flex items-center justify-center h-full text-gray-500">{t('noChartData')}</div> )}
                                </ChartWrapper>
                                <ChartWrapper title={t('temperatureFlows')}>
                                    {hasTemperatureData ? (
                                        <ResponsiveLine tooltip={CustomTooltip} data={chartData.temperature} theme={nivoTheme} colors={{ datum: 'color' }} margin={{ top: 10, right: 20, bottom: 120, left: 70 }} xScale={{ type: 'time', format: 'native' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }} axisBottom={{ format: '%b %d', tickValues: tickValues, legend: t('time'), legendOffset: 40 }} axisLeft={{ legend: `${t('temperature')} (°C)`, legendOffset: -50 }} enablePoints={false} useMesh={true} curve="monotoneX" legends={[{ anchor: 'bottom', direction: 'row', justify: false, translateX: 0, translateY: 80, itemsSpacing: 4, itemWidth: 180, itemHeight: 20, symbolSize: 12, itemTextColor: '#333' }]} />
                                    ) : ( <div className="flex items-center justify-center h-full text-gray-500">{t('noChartData')}</div> )}
                                </ChartWrapper>
                            </div>
                        </>
                    )}
                </div>
            </HistoricalSensorProvider>
    );
}
