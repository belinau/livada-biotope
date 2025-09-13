import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTranslation } from '../context/LanguageContext';
import { BED_MAPPING } from '../lib/constants';
import { SENSOR_COLORS } from '../lib/sensor-colors';
import { HistoricalSensorContext } from './HistoricalSensorVisualization';

// Enhanced Historical Graph Component with Zoom/Pan functionality
const EnhancedHistoricalGraphWithZoom = ({ 
    visibleMetrics, 
    visibleBeds,
    onRefreshData 
}) => {
    const { t, language } = useTranslation();
    const { history, status, startDate, endDate, onDateChange } = useContext(HistoricalSensorContext);
    const [chartData, setChartData] = useState([]);
    const [xAxisDomain, setXAxisDomain] = useState(null);
    const [yAxisDomain, setYAxisDomain] = useState(null);
    const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(formatDateForInput(startDate));
    const [tempEndDate, setTempEndDate] = useState(formatDateForInput(endDate));

    // Format dates for input fields
    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    // Calculate date difference for tick values
    const dateDiff = useMemo(() => {
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);

    const tickValues = useMemo(() => {
        if (dateDiff <= 7) return 'every 12 hours';
        if (dateDiff <= 30) return 'every 2 days';
        return 'every 7 days';
    }, [dateDiff]);

    // Simplified preset date ranges (only Last Month and Custom)
    const presets = useMemo(() => [
        { 
            id: '7days', 
            label: t('last7Days'), 
            getRange: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 7);
                return { start, end };
            }
        },
        { 
            id: '30days', 
            label: t('last30Days'), 
            getRange: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 30);
                return { start, end };
            }
        }
    ], [t]);

    // Handle preset selection
    const handlePresetSelect = (preset) => {
        const { start, end } = preset.getRange();
        onDateChange(start, end);
        setIsCustomRangeOpen(false);
    };

    // Handle custom date range apply
    const handleApplyCustomRange = () => {
        const [startYear, startMonth, startDay] = tempStartDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = tempEndDate.split('-').map(Number);
        
        const start = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
        const end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);
        
        onDateChange(start, end);
        setIsCustomRangeOpen(false);
    };

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
    const isLoading = status.key === 'loading';

    // Handle zoom in
    const handleZoomIn = useCallback(() => {
        if (!chartData || chartData.length === 0) return;
        
        if (!xAxisDomain || !yAxisDomain) {
            // Initialize domains if not set
            const allXValues = chartData.flatMap(series => series.data.map(d => d.x));
            const allYValues = chartData.flatMap(series => series.data.map(d => d.y)).filter(y => y !== null);
            
            if (allXValues.length === 0 || allYValues.length === 0) return;
            
            // Sort dates properly
            allXValues.sort((a, b) => a - b);
            
            const minX = allXValues[0];
            const maxX = allXValues[allXValues.length - 1];
            const minY = Math.min(...allYValues);
            const maxY = Math.max(...allYValues);
            
            // Zoom in by 20%
            const xRange = maxX - minX;
            const yRange = maxY - minY;
            const newXMin = new Date(minX.getTime() + xRange * 0.1);
            const newXMax = new Date(maxX.getTime() - xRange * 0.1);
            const newYMin = minY + yRange * 0.1;
            const newYMax = maxY - yRange * 0.1;
            
            setXAxisDomain([newXMin, newXMax]);
            setYAxisDomain([newYMin, newYMax]);
        } else {
            // Zoom in further
            const [xMin, xMax] = xAxisDomain;
            const [yMin, yMax] = yAxisDomain;
            
            // Validate that we have valid Date objects
            if (!(xMin instanceof Date) || !(xMax instanceof Date)) return;
            
            const xRange = xMax - xMin;
            const yRange = yMax - yMin;
            const newXMin = new Date(xMin.getTime() + xRange * 0.1);
            const newXMax = new Date(xMax.getTime() - xRange * 0.1);
            const newYMin = yMin + yRange * 0.1;
            const newYMax = yMax - yRange * 0.1;
            
            setXAxisDomain([newXMin, newXMax]);
            setYAxisDomain([newYMin, newYMax]);
        }
    }, [chartData, xAxisDomain, yAxisDomain]);

    // Handle zoom out
    const handleZoomOut = useCallback(() => {
        if (!chartData || chartData.length === 0) return;
        if (!xAxisDomain || !yAxisDomain) return;
        
        const [xMin, xMax] = xAxisDomain;
        const [yMin, yMax] = yAxisDomain;
        
        // Validate that we have valid Date objects
        if (!(xMin instanceof Date) || !(xMax instanceof Date)) return;
        
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;
        const newXMin = new Date(xMin.getTime() - xRange * 0.1);
        const newXMax = new Date(xMax.getTime() + xRange * 0.1);
        const newYMin = yMin - yRange * 0.1;
        const newYMax = yMax + yRange * 0.1;
        
        // Reset to full range if we've zoomed out too far
        const allXValues = chartData.flatMap(series => series.data.map(d => d.x));
        const allYValues = chartData.flatMap(series => series.data.map(d => d.y)).filter(y => y !== null);
        
        if (allXValues.length === 0 || allYValues.length === 0) return;
        
        // Sort dates properly
        allXValues.sort((a, b) => a - b);
        
        const minX = allXValues[0];
        const maxX = allXValues[allXValues.length - 1];
        const minY = Math.min(...allYValues);
        const maxY = Math.max(...allYValues);
        
        const finalXMin = newXMin < minX ? minX : newXMin;
        const finalXMax = newXMax > maxX ? maxX : newXMax;
        const finalYMin = newYMin < minY ? minY : newYMin;
        const finalYMax = newYMax > maxY ? maxY : newYMax;
        
        // If we're back to full range, reset domains to null
        if (finalXMin <= minX && finalXMax >= maxX && finalYMin <= minY && finalYMax >= maxY) {
            setXAxisDomain(null);
            setYAxisDomain(null);
        } else {
            setXAxisDomain([finalXMin, finalXMax]);
            setYAxisDomain([finalYMin, finalYMax]);
        }
    }, [chartData, xAxisDomain, yAxisDomain]);

    // Handle pan left
    const handlePanLeft = useCallback(() => {
        if (!chartData || chartData.length === 0) return;
        if (!xAxisDomain || !yAxisDomain) return;
        
        const [xMin, xMax] = xAxisDomain;
        const [yMin, yMax] = yAxisDomain;
        
        // Validate that we have valid Date objects
        if (!(xMin instanceof Date) || !(xMax instanceof Date)) return;
        
        const xRange = xMax - xMin;
        const shiftAmount = xRange * 0.1;
        
        const newXMin = new Date(xMin.getTime() - shiftAmount);
        const newXMax = new Date(xMax.getTime() - shiftAmount);
        
        // Check bounds
        const allXValues = chartData.flatMap(series => series.data.map(d => d.x));
        if (allXValues.length === 0) return;
        
        // Sort dates properly
        allXValues.sort((a, b) => a - b);
        
        const minX = allXValues[0];
        
        if (newXMin >= minX) {
            setXAxisDomain([newXMin, newXMax]);
            setYAxisDomain([yMin, yMax]);
        }
    }, [chartData, xAxisDomain, yAxisDomain]);

    // Handle pan right
    const handlePanRight = useCallback(() => {
        if (!chartData || chartData.length === 0) return;
        if (!xAxisDomain || !yAxisDomain) return;
        
        const [xMin, xMax] = xAxisDomain;
        const [yMin, yMax] = yAxisDomain;
        
        // Validate that we have valid Date objects
        if (!(xMin instanceof Date) || !(xMax instanceof Date)) return;
        
        const xRange = xMax - xMin;
        const shiftAmount = xRange * 0.1;
        
        const newXMin = new Date(xMin.getTime() + shiftAmount);
        const newXMax = new Date(xMax.getTime() + shiftAmount);
        
        // Check bounds
        const allXValues = chartData.flatMap(series => series.data.map(d => d.x));
        if (allXValues.length === 0) return;
        
        // Sort dates properly
        allXValues.sort((a, b) => a - b);
        
        const maxX = allXValues[allXValues.length - 1];
        
        if (newXMax <= maxX) {
            setXAxisDomain([newXMin, newXMax]);
            setYAxisDomain([yMin, yMax]);
        }
    }, [chartData, xAxisDomain, yAxisDomain]);

    // Reset view to full range
    const handleResetView = useCallback(() => {
        setXAxisDomain(null);
        setYAxisDomain(null);
    }, []);

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
                    <ResponsiveLine
                        data={chartData}
                        theme={nivoTheme}
                        margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
                        xScale={{ 
                            type: 'time', 
                            format: 'native',
                            ...(xAxisDomain ? { min: xAxisDomain[0], max: xAxisDomain[1] } : {})
                        }}
                        yScale={{ 
                            type: 'linear', 
                            min: 'auto', 
                            max: 'auto',
                            ...(yAxisDomain ? { min: yAxisDomain[0], max: yAxisDomain[1] } : {})
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
                        // Enable crosshair
                        enableCrosshair={true}
                        crosshairType="bottom-left"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] backdrop-blur-sm historical-graph-no-data-container">
                        <div className="text-center p-8 historical-graph-no-data-content">
                            <div className="text-4xl mb-3 historical-graph-no-data-emoji">📊</div>
                            <div className="text-body font-medium text-text-main historical-graph-no-data-text">{t('noChartData')}</div>
                            <div className="text-accent text-text-muted mt-2 historical-graph-no-data-subtext">Izberite vidne metrike ali razširite časovno obdobje</div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Unified interface pane with all controls */}
            <div className="mt-3 p-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm historical-graph-controls-container">
                {/* Top section: Date ranges */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--glass-border)] historical-graph-controls-section">
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset)}
                                className="px-2.5 py-1.5 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] text-xs shadow-md hover:shadow-lg transform hover:scale-105 historical-graph-preset-button"
                            >
                                {preset.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCustomRangeOpen(!isCustomRangeOpen)}
                            className={`px-2.5 py-1.5 text-text-main font-medium rounded-lg transition-all duration-300 border text-xs flex items-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105 ${
                                isCustomRangeOpen 
                                    ? 'bg-gradient-to-r from-primary to-primary-light text-white border-primary historical-graph-custom-range-button historical-graph-custom-range-button-active' 
                                    : 'bg-[var(--glass-bg-nav)] border-[var(--glass-border)] hover:bg-primary/30 historical-graph-custom-range-button historical-graph-custom-range-button-inactive'
                            }`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {t('customRange')}
                        </button>
                    </div>
                </div>
                
                {/* Custom date range picker (when open) */}
                {isCustomRangeOpen && (
                    <div className="pt-3 pb-2 border-b border-[var(--glass-border)] historical-graph-date-picker-container">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 historical-graph-date-picker-grid">
                            <div className="flex flex-col gap-1">
                                <label className="text-text-main text-xs font-medium historical-graph-date-picker-label">{t('startDate')}</label>
                                <input
                                    type="date"
                                    value={tempStartDate}
                                    onChange={(e) => setTempStartDate(e.target.value)}
                                    className="px-2 py-1.5 bg-[var(--glass-bg)] text-text-main border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-xs shadow-md hover:shadow-lg historical-graph-date-picker-input backdrop-blur-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-text-main text-xs font-medium historical-graph-date-picker-label">{t('endDate')}</label>
                                <input
                                    type="date"
                                    value={tempEndDate}
                                    onChange={(e) => setTempEndDate(e.target.value)}
                                    className="px-2 py-1.5 bg-[var(--glass-bg)] text-text-main border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-xs shadow-md hover:shadow-lg historical-graph-date-picker-input backdrop-blur-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 historical-graph-date-picker-buttons">
                            <button
                                onClick={() => setIsCustomRangeOpen(false)}
                                className="px-3 py-1.5 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all duration-300 border border-[var(--glass-border)] text-xs shadow-md hover:shadow-lg transform hover:scale-105 historical-graph-date-picker-button historical-graph-date-picker-button-cancel"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleApplyCustomRange}
                                className="px-3 py-1.5 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-lg hover:from-primary-light hover:to-primary transition-all duration-300 text-xs shadow-md hover:shadow-lg transform hover:scale-105 historical-graph-date-picker-button historical-graph-date-picker-button-apply"
                            >
                                {t('apply')}
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Middle section: Current range display and refresh */}
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[var(--glass-border)] historical-graph-controls-section">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse historical-graph-date-indicator"></div>
                            <span className="text-text-main text-xs historical-graph-date-text">
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                            </span>
                        </div>
                        <span className="text-text-muted text-xs historical-graph-date-range-text">
                            ({Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} {t('days')})
                        </span>
                    </div>
                    <button
                        onClick={onRefreshData}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] text-xs shadow-md hover:shadow-lg transform hover:scale-105 historical-graph-refresh-button"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                        </svg>
                        {t('refresh')}
                    </button>
                </div>
                
                {/* Zoom controls */}
                <div className="flex justify-end pt-3 historical-graph-bottom-controls">
                    <div className="flex items-center gap-1 historical-graph-zoom-controls">
                        <button
                            onClick={handleZoomIn}
                            className="p-1.5 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] historical-graph-zoom-button shadow-md hover:shadow-lg transform hover:scale-110"
                            title={t('zoomIn')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button
                            onClick={handleZoomOut}
                            className="p-1.5 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] historical-graph-zoom-button shadow-md hover:shadow-lg transform hover:scale-110"
                            title={t('zoomOut')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                            </svg>
                        </button>
                        <div className="h-4 w-px bg-[var(--glass-border)] historical-graph-zoom-divider"></div>
                        <button
                            onClick={handlePanLeft}
                            className="p-1.5 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] historical-graph-zoom-button shadow-md hover:shadow-lg transform hover:scale-110"
                            title={t('panLeft')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handlePanRight}
                            className="p-1.5 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/30 transition-all duration-300 border border-[var(--glass-border)] historical-graph-zoom-button shadow-md hover:shadow-lg transform hover:scale-110"
                            title={t('panRight')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="h-4 w-px bg-[var(--glass-border)] historical-graph-zoom-divider"></div>
                        <button
                            onClick={handleResetView}
                            className="p-1.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:from-primary-light hover:to-primary transition-all duration-300 border border-primary historical-graph-zoom-button shadow-md hover:shadow-lg transform hover:scale-110"
                            title={t('resetView')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedHistoricalGraphWithZoom;
