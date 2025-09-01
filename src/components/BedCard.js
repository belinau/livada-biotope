import React from 'react';
import MetricCard from './MetricCard';
import { GlassCard } from './ui/GlassCard';

const BedCard = ({ bed, reading, t }) => {
    const lastHeard = reading ? new Date(reading.timestamp) : null;
    return (
        <GlassCard className="flex flex-col" padding="p-0" rounded="xl">
            <div className="p-4 flex justify-between items-center bg-gradient-to-r" style={{ background: `linear-gradient(135deg, ${bed.color}, ${bed.color}dd)`, color: 'white' }}>
                <h4 className="text-white text-lg group-hover:scale-105 transition-transform duration-200">{bed.name}</h4>
                <div className="w-3 h-3 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors duration-200"></div>
            </div>
            <div className="p-5 space-y-4 flex-grow">
                {reading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        <MetricCard label={t('soilMoisture')} value={reading.moisture} unit="%" decimals={1} />
                        <MetricCard label={t('soilTemp')} value={reading.temperature} unit="°C" decimals={1} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 text-text-muted bg-bg-main/50 rounded-lg border-2 border-dashed border-border-color">
                        <div className="text-center">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="text-accent text-sm">{t('noSensorData')}</div>
                        </div>
                    </div>
                )}
            </div>
            {lastHeard && (
                <div className="backdrop-blur-sm p-3 text-xs text-text-muted flex justify-between items-center border-t border-border-color/50">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse"></div>
                        <span className="text-accent font-medium">Live</span>
                    </div>
                    <span className="text-accent">{t('lastUpdated')}: {lastHeard.toLocaleString(t.language)}</span>
                </div>
            )}
        </GlassCard>
    );
};

export default BedCard;
