import React, { useMemo } from 'react';
import { useTranslation } from '../context/LanguageContext';

// Convert wind direction to compass bearing
export const getCompassDirection = (degrees) => {
    if (degrees === null || degrees === undefined || isNaN(degrees)) return null;
    
    // 16-direction compass rose
    const directions = ['S', 'SSV', 'SV', 'VSV', 'V', 'VJV', 'JV', 'JJV', 
                       'J', 'JJZ', 'JZ', 'ZJZ', 'Z', 'ZSZ', 'SZ', 'SSZ'];
    const index = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
    return directions[index];
};

// Map Slovenian abbreviations to full names for display
export const getCompassLabel = (abbr, t) => {
    if (!abbr) return '';
    const labels = {
        'S': t('north'), 'J': t('south'), 'V': t('east'), 'Z': t('west'),
        'SV': t('northeast'), 'JV': t('southeast'), 'JZ': t('southwest'), 'SZ': t('northwest'),
        'SSV': t('northNorthEast'), 'VSV': t('eastNorthEast'), 'VJV': t('eastSouthEast'),
        'JJV': t('southSouthEast'), 'JJZ': t('southSouthWest'), 'ZJZ': t('westSouthWest'),
        'ZSZ': t('westNorthWest'), 'SSZ': t('northNorthWest')
    };
    return labels[abbr] || abbr;
};

/**
 * WindCompass Component
 * Displays a compass visualization showing wind direction with a lightsaber arrow.
 * Minimal design - no background (glassmorphic wrapper provides that).
 * Fonts and colors match SensorGauges.js exactly.
 * Proper decimal formatting based on language (comma for SL, period for EN).
 */
const WindCompass = ({ windDirection, windSpeed, windGust, language = 'sl', minimal = false }) => {
    const { t } = useTranslation();

    const compassDirection = useMemo(() => getCompassDirection(windDirection), [windDirection]);

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

    const speedKmh = msToKmh(windSpeed);
    const gustKmh = msToKmh(windGust);

    return (
        <div className="w-full flex flex-col items-center">
            {/* Compass SVG - Minimal design, no background */}
            <svg viewBox="0 0 120 120" className="w-32 h-32">
                <defs>
                    {/* Lightsaber blade gradient */}
                    <linearGradient id="lightsaberGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="1"/>
                        <stop offset="30%" stopColor="var(--primary)" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.4"/>
                    </linearGradient>
                    
                    {/* Glow filter */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Cardinal direction ticks only */}
                {[0, 90, 180, 270].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 60 + 54 * Math.sin(rad);
                    const y1 = 60 - 54 * Math.cos(rad);
                    const x2 = 60 + 48 * Math.sin(rad);
                    const y2 = 60 - 48 * Math.cos(rad);
                    return (
                        <line 
                            key={i} 
                            x1={x1} y1={y1} x2={x2} y2={y2} 
                            stroke="var(--text-sage)" 
                            strokeWidth="2"
                            strokeLinecap="round"
                            opacity="0.6"
                        />
                    );
                })}
                
                {/* Intercardinal ticks */}
                {[45, 135, 225, 315].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 60 + 54 * Math.sin(rad);
                    const y1 = 60 - 54 * Math.cos(rad);
                    const x2 = 60 + 50 * Math.sin(rad);
                    const y2 = 60 - 50 * Math.cos(rad);
                    return (
                        <line 
                            key={i} 
                            x1={x1} y1={y1} x2={x2} y2={y2} 
                            stroke="var(--text-muted)" 
                            strokeWidth="1"
                            strokeLinecap="round"
                            opacity="0.4"
                        />
                    );
                })}
                
                {/* Cardinal directions (S, J, V, Z) - matching SensorGauges font */}
                <text x="60" y="22" textAnchor="middle" className="fill-text-sage" style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>S</text>
                <text x="60" y="108" textAnchor="middle" className="fill-text-sage" style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>J</text>
                <text x="106" y="65" textAnchor="middle" className="fill-text-sage" style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>V</text>
                <text x="14" y="65" textAnchor="middle" className="fill-text-sage" style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Z</text>
                
                {/* Intercardinal directions */}
                <text x="86" y="36" textAnchor="middle" className="fill-text-muted" style={{ fontSize: '10px', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>SV</text>
                <text x="86" y="92" textAnchor="middle" className="fill-text-muted" style={{ fontSize: '10px', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>JV</text>
                <text x="34" y="92" textAnchor="middle" className="fill-text-muted" style={{ fontSize: '10px', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>JZ</text>
                <text x="34" y="36" textAnchor="middle" className="fill-text-muted" style={{ fontSize: '10px', fontWeight: '500', fontFamily: 'var(--font-mono)' }}>SZ</text>
                
                {/* Lightsaber arrow */}
                {windDirection !== null && windDirection !== undefined && !isNaN(windDirection) && (
                    <g transform={`rotate(${windDirection}, 60, 60)`} filter="url(#glow)">
                        {/* Blade */}
                        <line 
                            x1="60" y1="45" x2="60" y2="16" 
                            stroke="url(#lightsaberGlow)" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            opacity="0.9"
                        />
                        {/* Inner core */}
                        <line 
                            x1="60" y1="45" x2="60" y2="16" 
                            stroke="var(--bg-main)" 
                            strokeWidth="1.5" 
                            strokeLinecap="round"
                            opacity="0.5"
                        />
                        {/* Tip glow */}
                        <circle cx="60" cy="16" r="3" fill="var(--primary)" opacity="0.6"/>
                        
                        {/* Handle */}
                        <rect x="58" y="45" width="4" height="12" rx="1" fill="var(--text-muted)" opacity="0.6"/>
                    </g>
                )}
                
                {/* Center point */}
                <circle cx="60" cy="60" r="3" fill="var(--primary)" opacity="0.5"/>
            </svg>
            
            {/* Wind data */}
            {!minimal && (
                <div className="mt-1 w-full flex flex-col items-center text-center">
                    {/* Direction - moved immidiatelly under compass */}
                    {windDirection !== null && windDirection !== undefined && (
                        <div className="mb-3">
                            <div className="text-xs text-[var(--text-sage)] font-mono font-bold">
                                {Math.round(windDirection)}° {compassDirection && getCompassLabel(compassDirection, t)}
                            </div>
                        </div>
                    )}

                    {/* Wind speed */}
                    {windSpeed !== null && windSpeed !== undefined && (
                        <div className="mb-0.5">
                            <div className="text-[var(--text-sage)] font-medium text-xs opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>{t('windSpeed')}</div>
                            <div className="text-lg font-mono font-bold text-[var(--text-sage)]">
                                {formatDecimal(windSpeed, 3)} m/s <span className="text-sm font-normal">({formatDecimal(speedKmh, 1)} km/h)</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Wind gust */}
                    {windGust !== null && windGust !== undefined && (
                        <div className="mb-0.5">
                            <div className="text-[var(--text-sage)] font-medium text-xs opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>{t('windGust')}</div>
                            <div className="text-lg font-mono font-bold text-[var(--text-sage)]">
                                {formatDecimal(windGust, 3)} m/s <span className="text-sm font-normal">({formatDecimal(gustKmh, 1)} km/h)</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WindCompass;
