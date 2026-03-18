import React, { useMemo } from 'react';
import WindCompass, { getCompassDirection, getCompassLabel } from './WindCompass';
import { GlassCard } from './ui/GlassCard';
import { useTranslation } from '../context/LanguageContext';

/**
 * WeatherCard Component
 * Displays ALL weather station data in one card:
 * - Air temperature
 * - Air humidity
 * - Wind speed (m/s + km/h)
 * - Wind gust (m/s + km/h)
 * - Wind direction (compass)
 * 
 * Matches BedCard styling exactly.
 */
const WeatherCard = ({ weatherData, t }) => {
    const { t: translateT, language } = useTranslation();
    const translate = t || translateT;
    
    const latest = weatherData?.latest || {};
    const latestDirection = weatherData?.direction?.[weatherData.direction.length - 1]?.y;
    
    // Calculations for wind values
    const compassDirection = useMemo(() => getCompassDirection(latestDirection), [latestDirection]);
    const directionLabel = compassDirection ? getCompassLabel(compassDirection, translate) : '';
    
    // Convert m/s to km/h
    const msToKmh = (ms) => {
        if (ms === null || ms === undefined || isNaN(ms)) return null;
        return Math.round(ms * 3.6 * 10) / 10;
    };

    // Format number with proper decimal separator based on language
    const formatDecimal = (num, precision = 3) => {
        if (num === null || num === undefined || isNaN(num)) return '—';
        const fixed = Number(num).toFixed(precision);
        if (language === 'sl') {
            return fixed.replace('.', ',');
        }
        return fixed;
    };

    const formatTime = (ts) => {
        if (!ts) return '--:--:--';
        const date = new Date(ts);
        return date.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    const formatDate = (ts) => {
        if (!ts) return '';
        const date = new Date(ts);
        if (language === 'sl') {
            // Slovenian format: 18. 3. 2026 (no leading zero on day/month, space after dot)
            return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
        }
        return date.toLocaleDateString(language);
    };

    const timestamp = latest.timestamp;

    const speedKmh = msToKmh(latest.wind_speed);
    const gustKmh = msToKmh(latest.wind_gust);

    return (
        <GlassCard className="flex flex-col h-full relative" padding="p-0" rounded="xl">
            {/* Header - matches BedCard header */}
            <div className="p-3 flex justify-between items-center bg-gradient-to-t relative z-10" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary)dd)', color: 'var(--text-sage)' }}>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--text-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <h4 className="text-[var(--text-sage)] text-base" style={{ fontWeight: '500' }}>{translate('weatherStation')}</h4>
                </div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
            
            {/* Content - split into compass and metrics */}
            <div className="p-4 flex-grow min-h-0 relative">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full items-center">
                    
                    {/* Column 1: Compass Visual */}
                    <div className="flex justify-center min-w-0">
                        <WindCompass 
                            windDirection={latestDirection}
                            windSpeed={latest.wind_speed}
                            windGust={latest.wind_gust}
                            language={language}
                            minimal={true}
                        />
                    </div>
                    
                    {/* Column 2: Wind Data */}
                    <div className="flex flex-col justify-center space-y-4 pl-2 border-l border-white/10 min-w-0">
                        {latestDirection !== null && latestDirection !== undefined && (
                            <div className="flex flex-col">
                                <div className="text-[var(--text-sage)] font-medium text-xs whitespace-nowrap opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>{translate('windDirection')}</div>
                                <div className="text-base font-mono font-bold text-[var(--text-sage)] leading-tight">
                                    {Math.round(latestDirection)}° {directionLabel}
                                </div>
                            </div>
                        )}
                        {latest.wind_speed !== null && (
                            <div className="flex flex-col">
                                <div className="text-[var(--text-sage)] font-medium text-xs whitespace-nowrap opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>{translate('windSpeed')} / {translate('windGust')}</div>
                                <div className="text-xl font-mono font-bold text-[var(--text-sage)] leading-tight">
                                    {formatDecimal(latest.wind_speed, 1)} / {formatDecimal(latest.wind_gust, 1)} m/s
                                </div>
                                <div className="text-xs text-[var(--text-sage)] opacity-70 font-mono">
                                    ({formatDecimal(speedKmh, 1)} / {formatDecimal(gustKmh, 1)} km/h)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column 3: Air temperature and humidity */}
                    <div className="flex flex-col justify-center space-y-4 pl-2 border-l border-white/10 min-w-0 relative">
                        {/* Air temperature */}
                        {latest.air_temperature !== null && latest.air_temperature !== undefined && (
                            <div className="flex flex-col">
                                <div className="text-[var(--text-sage)] font-medium text-xs whitespace-nowrap opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>{translate('airTemp')}</div>
                                <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-sage)] leading-tight">
                                    {formatDecimal(latest.air_temperature)}°C
                                </div>
                            </div>
                        )}
                        
                        {/* Air humidity */}
                        {latest.air_humidity !== null && latest.air_humidity !== undefined && (
                            <div className="flex flex-col">
                                <div className="text-[var(--text-sage)] font-medium text-xs whitespace-nowrap opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>{translate('airHumidity')}</div>
                                <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--text-sage)] leading-tight">
                                    {formatDecimal(latest.air_humidity)}%
                                </div>
                            </div>
                        )}

                        {/* Timestamp positioned in this column */}
                        <div className="pt-2 mt-auto text-right">
                            <div className="text-xs text-[var(--text-sage)] font-mono opacity-80">{formatTime(timestamp)}</div>
                            <div className="text-xs text-[var(--text-sage)] font-mono opacity-80">{formatDate(timestamp)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default WeatherCard;
