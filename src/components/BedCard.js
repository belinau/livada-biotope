import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { useTranslation } from '../context/LanguageContext';
import SoilMoistureIndicator    from './sensor-indicators/SoilMoistureIndicator';
import SoilTemperatureIndicator from './sensor-indicators/SoilTemperatureIndicator';

/**
 * BedCard
 *
 * Replaces the old wave-canvas SensorGauges with the new organic indicators.
 * Shows one soil bed's moisture + temperature side-by-side.
 *
 * Props:
 *   bed     { name, location, ... }   from BED_MAPPING
 *   reading { moisture, temperature, timestamp }
 *   t       translation function (optional, falls back to context)
 */
const BedCard = ({ bed, reading, t: tProp }) => {
  const { t: tCtx, language } = useTranslation();
  const t = tProp || tCtx;

  const formatTime = (ts) => {
    if (!ts) return '--:--';
    return new Date(ts).toLocaleTimeString(language, {
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return language === 'sl'
      ? `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`
      : d.toLocaleDateString(language);
  };

  const hasMoisture    = reading?.moisture    !== null && reading?.moisture    !== undefined;
  const hasTemperature = reading?.temperature !== null && reading?.temperature !== undefined;

  return (
    <GlassCard className="flex flex-col h-full" padding="p-0" rounded="xl">
      {/* Header */}
      <div
        className="p-3 flex justify-between items-center"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary)dd)', color: 'var(--text-sage)' }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h4 className="text-base font-medium text-[var(--text-sage)]">
            {bed?.name ? t(bed.name) : t('soilSensor')}
          </h4>
        </div>
        {reading?.timestamp && (
          <div className="text-right text-[10px] font-mono text-[var(--text-sage)] opacity-55">
            <div>{formatTime(reading.timestamp)}</div>
            <div>{formatDate(reading.timestamp)}</div>
          </div>
        )}
      </div>

      {/* Indicators */}
      <div className="p-3 flex-grow min-h-0">
        {hasMoisture && hasTemperature ? (
          // Both sensors — side by side
          <div className="grid grid-cols-2 gap-2 h-full items-center">
            <SoilMoistureIndicator    soilMoisture={reading.moisture}    lastUpdated={reading.timestamp} />
            <SoilTemperatureIndicator soilTemperature={reading.temperature} lastUpdated={reading.timestamp} />
          </div>
        ) : hasMoisture ? (
          <div className="flex justify-center">
            <SoilMoistureIndicator soilMoisture={reading.moisture} lastUpdated={reading.timestamp} />
          </div>
        ) : hasTemperature ? (
          <div className="flex justify-center">
            <SoilTemperatureIndicator soilTemperature={reading.temperature} lastUpdated={reading.timestamp} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm">
            {t('noSensorData')}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default BedCard;
