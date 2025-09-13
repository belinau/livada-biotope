import React from 'react';
import { SoilMoistureWave, SoilTemperatureWave } from './SensorGauges';
import { GlassCard } from './ui/GlassCard';

const BedCard = ({ bed, reading, t }) => {
    const lastHeard = reading ? new Date(reading.timestamp) : null;
    return (
        <GlassCard className="flex flex-col h-full bg-gradient-to-t from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm border border-[var(--glass-border)] rounded-xl shadow-xl" padding="p-0" rounded="xl">
            <div className="p-3 flex justify-between items-center bg-gradient-to-t" style={{ background: `linear-gradient(135deg, ${bed.color}, ${bed.color}dd)`, color: '-[var(--text-sage)]' }}>
                <h4 className="text-[var(--text-sage)] text-base group-hover:scale-105 transition-transform duration-200">{t(bed.name)}</h4>
                <div className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors duration-200"></div>
            </div>
            <div className="p-3 space-y-3 flex-grow min-h-0">
                {reading ? (
                    <div className="space-y-3 h-full flex flex-col">
                        <SoilMoistureWave 
                            value={reading.moisture} 
                            label={t('soilMoisture')} 
                            unit="%" 
                            lastUpdated={lastHeard}
                        />
                        <SoilTemperatureWave 
                            value={reading.temperature} 
                            label={t('soilTemp')} 
                            unit="°C" 
                            lastUpdated={lastHeard}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-grow text-[var(--text-sage)] bg-transparent rounded-lg border-2 border-dashed border-border-color">
                        <div className="text-center">
                            <div className="text-xl mb-1">📊</div>
                            <div className="text-[var(--text-sage)] text-xs">{t('noSensorData')}</div>
                        </div>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

export default BedCard;