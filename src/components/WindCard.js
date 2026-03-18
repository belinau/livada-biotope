import React from 'react';
import WindCompass from './WindCompass';
import { GlassCard } from './ui/GlassCard';
import { useTranslation } from '../context/LanguageContext';

/**
 * WindCard Component - matches BedCard styling exactly
 */
const WindCard = ({ windData, t }) => {
    const { t: translateT, language } = useTranslation();
    const translate = t || translateT;
    
    const latestWind = windData?.latest || {};
    const latestDirection = windData?.direction?.[windData.direction.length - 1]?.y;

    return (
        <GlassCard className="flex flex-col h-full" padding="p-0" rounded="xl">
            {/* Header - matches BedCard header */}
            <div className="p-3 flex justify-between items-center bg-gradient-to-t" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary)dd)', color: 'var(--text-sage)' }}>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--text-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    <h4 className="text-[var(--text-sage)] text-base" style={{ fontWeight: '500' }}>{translate('windCompass')}</h4>
                </div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
            
            {/* Content - matches BedCard content */}
            <div className="p-3 flex-grow min-h-0">
                <WindCompass 
                    windDirection={latestDirection}
                    windSpeed={latestWind.wind_speed}
                    windGust={latestWind.wind_gust}
                    language={language}
                />
            </div>
        </GlassCard>
    );
};

export default WindCard;
