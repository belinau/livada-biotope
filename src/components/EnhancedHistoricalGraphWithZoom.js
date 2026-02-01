import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTranslation } from '../context/LanguageContext';
import { BED_MAPPING } from '../lib/constants';
import { SENSOR_COLORS } from '../lib/sensor-colors';
import { HistoricalSensorContext } from './EnhancedHistoricalVisualization';

const EnhancedHistoricalGraphWithZoom = ({
    visibleMetrics,
    visibleBeds
}) => {
    const { t, language } = useTranslation();
    const { history, startDate, endDate, status } = useContext(HistoricalSensorContext);
    const [chartData, setChartData] = useState([]);

    const isLoading = status.key === 'loading';

    const dateDiff = useMemo(() => {
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);

    const tickValues = useMemo(() => {
        if (dateDiff <= 7) return 'every 12 hours';
        if (dateDiff <= 30) return 'every 2 days';
        return 'every 7 days';
    }, [dateDiff]);

    const nivoTheme = useMemo(() => {
        if (typeof window === 'undefined') return {};
        const style = getComputedStyle(document.documentElement);
        return {
            background: 'transparent',
            textColor: style.getPropertyValue('--text-main') || '#ffffff',
            fontSize: 12,
            axis: {
                domain: {
                    line: {
                        stroke: style.getPropertyValue('--glass-border') || '#ffffff33',
                        strokeWidth: 1
                    }
                },
                ticks: {
                    line: {
                        stroke: style.getPropertyValue('--glass-border') || '#ffffff33',
                        strokeWidth: 1
                    },
                    text: {
                        fill: style.getPropertyValue('--text-muted') || '#ffffffaa',
                        fontSize: 11
                    }
                },
                legend: {
                    text: {
                        fill: style.getPropertyValue('--text-main') || '#ffffff',
                        fontSize: 12
                    }
                }
            },
            grid: {
                line: {
                    stroke: style.getPropertyValue('--glass-border') || '#ffffff33',
                    strokeWidth: 1,
                    strokeDasharray: '2 2'
                }
            },
            legends: {
                text: {
                    fill: style.getPropertyValue('--text-main') || '#ffffff',
                    fontSize: 12
                }
            },
            tooltip: {
                container: {
                    background: style.getPropertyValue('--glass-bg') || '#1a1a2e',
                    color: style.getPropertyValue('--text-main') || '#ffffff',
                    border: `1px solid ${style.getPropertyValue('--glass-border') || '#ffffff33'}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }
            }
        };
    }, []);

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

    useEffect(() => {
        if (!history || typeof history !== 'object') {
            setChartData([]);
            return;
        }

        const newChartData = [];

        // Process each key in history
        Object.keys(history).forEach(historyKey => {
            const dataArray = history[historyKey];

            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                return;
            }

            // Check if this is air data (airHumidity, airTemperature)
            if (historyKey === 'airHumidity' && visibleMetrics.airHumidity) {
                newChartData.push({
                    id: t('airHumidity'),
                    color: SENSOR_COLORS.airHumidity?.line || '#00bcd4',
                    data: dataArray.map(item => ({
                        x: new Date(item.x),
                        y: typeof item.y === 'number' && !isNaN(item.y) ? item.y : null
                    }))
                });
                return;
            }

            if (historyKey === 'airTemperature' && visibleMetrics.airTemperature) {
                newChartData.push({
                    id: t('airTemp'),
                    color: SENSOR_COLORS.airTemperature?.line || '#ff9800',
                    data: dataArray.map(item => ({
                        x: new Date(item.x),
                        y: typeof item.y === 'number' && !isNaN(item.y) ? item.y : null
                    }))
                });
                return;
            }

            // Process bed data (format: bedId-metricType)
            const lastDashIndex = historyKey.lastIndexOf('-');
            if (lastDashIndex === -1) return;

            const bedId = historyKey.substring(0, lastDashIndex);
            const metricType = historyKey.substring(lastDashIndex + 1);

            const bedInfo = BED_MAPPING[bedId];
            if (!bedInfo) return;

            const isMetricVisible = visibleMetrics[metricType];
            const isBedVisible = visibleBeds?.[bedId] !== false;

            if (isMetricVisible && isBedVisible) {
                const color = SENSOR_COLORS[metricType]?.line || '#76e4f7';
                newChartData.push({
                    id: `${bedInfo.name} - ${t(metricType)}`,
                    color: color,
                    data: dataArray.map(item => ({
                        x: new Date(item.x),
                        y: typeof item.y === 'number' && !isNaN(item.y) ? item.y : null
                    }))
                });
            }
        });

        setChartData(newChartData);
    }, [history, visibleMetrics, visibleBeds, t]);

    const hasData = chartData.length > 0 && chartData.some(series =>
        series.data && series.data.length > 0
    );

    if (isLoading) {
        return (
            <div className="h-[500px] w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                    </div>
                    <div className="text-body-lg text-text-muted">{t('loading')}...</div>
                </div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="h-[500px] w-full flex items-center justify-center bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] backdrop-blur-sm">
                <div className="text-center p-8">
                    <div className="text-4xl mb-3">📊</div>
                    <div className="text-body font-medium text-text-main">{t('noChartData')}</div>
                    <div className="text-accent text-text-muted mt-2">
                        Izberite vidne metrike ali razširite časovno obdobje
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[500px] w-full">
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
        </div>
    );
};

export default EnhancedHistoricalGraphWithZoom;