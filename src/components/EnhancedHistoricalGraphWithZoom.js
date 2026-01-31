import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTranslation } from '../context/LanguageContext';
import { BED_MAPPING } from '../lib/constants';
import { SENSOR_COLORS } from '../lib/sensor-colors';
import { HistoricalSensorContext } from './EnhancedHistoricalVisualization';

// Enhanced Historical Graph Component with Zoom/Pan functionality
const EnhancedHistoricalGraphWithZoom = ({ 
    visibleMetrics, 
    visibleBeds
}) => {
    const { t, language } = useTranslation();
    const { history, startDate, endDate, status } = useContext(HistoricalSensorContext);
    console.log('EnhancedHistoricalGraphWithZoom rendered with history:', history);
    const [chartData, setChartData] = useState([]);

    const isLoading = status.key === 'loading';

    // Calculate date difference for tick values
    const dateDiff = useMemo(() => {
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);

    const tickValues = useMemo(() => {
        if (dateDiff <= 7) return 'every 12 hours';
        if (dateDiff <= 30) return 'every 2 days';
        return 'every 7 days';
    }, [dateDiff]);

    // Nivo theme matching glassmorphic styling
    const nivoTheme = useMemo(() => {
        if (typeof window === 'undefined') return {};
        const style = getComputedStyle(document.documentElement);
        return {
            background: 'transparent',
            textColor: style.getPropertyValue('--text-main'),
            fontSize: 12,
            axis: {
                domain: {
                    line: {
                        stroke: style.getPropertyValue('--glass-border'),
                        strokeWidth: 1
                    }
                },
                ticks: {
                    line: {
                        stroke: style.getPropertyValue('--glass-border'),
                        strokeWidth: 1
                    },
                    text: {
                        fill: style.getPropertyValue('--text-muted'),
                        fontSize: 11
                    }
                },
                legend: {
                    text: {
                        fill: style.getPropertyValue('--text-main'),
                        fontSize: 12
                    }
                }
            },
            grid: {
                line: {
                    stroke: style.getPropertyValue('--glass-border'),
                    strokeWidth: 1,
                    strokeDasharray: '2 2'
                }
            },
            legends: {
                text: {
                    fill: style.getPropertyValue('--text-main'),
                    fontSize: 12
                }
            },
            tooltip: {
                container: {
                    background: style.getPropertyValue('--glass-bg'),
                    color: style.getPropertyValue('--text-main'),
                    border: `1px solid ${style.getPropertyValue('--glass-border')}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }
            }
        };
    }, []);

    // Custom tooltip component with crosshair functionality
    const CustomTooltip = ({ point }) => {
        const date = new Date(point.data.x);
        const formattedDate = date.toLocaleString(language, {
            dateStyle: 'short',
            timeStyle: 'short',
        });
        
        return (
            <div className="bg-[var(--glass-bg)] p-3 border border-[var(--glass-border)] rounded-xl shadow-lg backdrop-blur-sm">
                <div className="flex items-center mb-1">
                    <span 
                        style={{ 
                            display: 'block', 
                            width: '12px', 
                            height: '12px', 
                            background: point.serieColor, 
                            marginRight: '8px',
                            borderRadius: '50%'
                        }}
                    ></span>
                    <strong className="text-text-main font-semibold">{point.serieId}</strong>
                </div>
                <div className="text-text-muted text-sm mb-1">{formattedDate}</div>
                <div className="text-text-main font-medium">{`${point.data.yFormatted}`}</div>
            </div>
        );
    };

    // Process history data into chart format
    useEffect(() => {
        if (!history) return;

        const newChartData = [];
        const processDataPoint = (item) => ({ 
            x: new Date(item.x), 
            y: typeof item.y === 'number' && !isNaN(item.y) ? item.y : null 
        });

        // Process bed data
        for (const historyKey in history) {
            if (Array.isArray(history[historyKey]) && history[historyKey].length > 0) {
                const seriesData = history[historyKey].map(processDataPoint);
                const bedId = historyKey.substring(0, historyKey.lastIndexOf('-'));
                const metricType = historyKey.substring(historyKey.lastIndexOf('-') + 1);

                const bedInfo = BED_MAPPING[bedId];
                if (bedInfo) {
                    // Check if both the metric and bed are visible
                    const isMetricVisible = visibleMetrics[metricType];
                    const isBedVisible = visibleBeds ? visibleBeds[bedId] : true;
                    
                    if (isMetricVisible && isBedVisible) {
                        // Use unified color mapping
                        const color = SENSOR_COLORS[metricType]?.line || '#76e4f7';
                        newChartData.push({
                            id: `${bedInfo.name} - ${t(metricType)}`,
                            color: color,
                            data: seriesData
                        });
                    }
                }
            }
        }

        // Process air data (always visible if metric is visible, not tied to specific beds)
        if (visibleMetrics.airHumidity && history.airHumidity?.length > 0) {
            newChartData.push({
                id: t('airHumidity'),
                color: SENSOR_COLORS.airHumidity.line,
                data: history.airHumidity.map(processDataPoint)
            });
        }
        
        if (visibleMetrics.airTemperature && history.airTemperature?.length > 0) {
            newChartData.push({
                id: t('airTemp'),
                color: SENSOR_COLORS.airTemperature.line,
                data: history.airTemperature.map(processDataPoint)
            });
        }

        setChartData(newChartData);
    }, [history, visibleMetrics, visibleBeds, t]);

    const hasData = chartData.some(series => series.data.length > 1);
    
    return (
        <div className="w-full historical-graph-container">
            {/* Chart Container */}
            <div className="h-[500px] w-full historical-graph-chart-container">
                {isLoading && !history ? (
                    <div className="flex items-center justify-center h-full historical-graph-loading-container">
                        <div className="text-center historical-graph-loading-content">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white animate-spin historical-graph-loading-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                                </svg>
                            </div>
                            <div className="text-body-lg text-text-muted historical-graph-loading-text">{t('loading')}...</div>
                            <div className="text-accent text-text-muted mt-2 historical-graph-loading-subtext">{t('loadingDescription')}</div>
                        </div>
                    </div>
                                ) : hasData ? (
                                    <div key={`${startDate.toISOString()}-${endDate.toISOString()}`}>
                                        <ResponsiveLine
                                            data={chartData}
                                            theme={nivoTheme}
                                            margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
                                            xScale={{
                                                type: 'time',
                                                format: 'native',
                                                min: startDate,
                                                max: endDate,
                                            }}
                                            yScale={{
                                                type: 'linear',
                                                min: 'auto',
                                                max: 'auto',
                                            }}
                                            axisBottom={{
                                                format: '%b %d',
                                                tickValues: tickValues,
                                                legend: t('time'),
                                                legendOffset: 40,
                                                legendPosition: 'middle',
                                                tickRotation: -45
                                            }}
                                            axisLeft={{
                                                legend: t('values'),
                                                legendOffset: -60,
                                                legendPosition: 'middle'
                                            }}
                                            colors={{ datum: 'color' }}
                                            enablePoints={false}
                                            useMesh={true}
                                            curve="monotoneX"
                                            animate={true}
                                            motionConfig="gentle"
                                            tooltip={CustomTooltip}
                                            legends={[]}
                                            enableCrosshair={true}
                                            crosshairType="bottom-left"
                                        />
                                    </div>                ) : (
                    <div className="flex items-center justify-center h-full bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] backdrop-blur-sm historical-graph-no-data-container">
                        <div className="text-center p-8 historical-graph-no-data-content">
                            <div className="text-4xl mb-3 historical-graph-no-data-emoji">📊</div>
                            <div className="text-body font-medium text-text-main historical-graph-no-data-text">{t('noChartData')}</div>
                            <div className="text-accent text-text-muted mt-2 historical-graph-no-data-subtext">Izberite vidne metrike ali razširite časovno obdobje</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedHistoricalGraphWithZoom;
