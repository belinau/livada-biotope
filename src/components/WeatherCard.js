import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { useTranslation } from '../context/LanguageContext';
import WindSpeedIndicator   from './sensor-indicators/WindSpeedIndicator';
import WindCompassIndicator from './sensor-indicators/WindCompassIndicator';
import AirTemperatureIndicator from './sensor-indicators/AirTemperatureIndicator';
import AirHumidityIndicator    from './sensor-indicators/AirHumidityIndicator';

/**
 * WeatherCard
 *
 * Displays all four weather-station readings in a 2×2 grid of sensor
 * indicators: wind compass, wind speed, air temperature, air humidity.
 *
 * Data shape (from LiveSensorReadings):
 *   weatherData.latest = {
 *     wind_speed, wind_gust, wind_direction,
 *     air_temperature, air_humidity, timestamp
 *   }
 *   weatherData.direction = [{ x: Date, y: degrees }]
 */
const WeatherCard = ({ weatherData, t: tProp }) => {
  const { t: tCtx, language } = useTranslation();
  const t       = tProp || tCtx;
  const latest  = weatherData?.latest || {};
  const lastDir = weatherData?.direction?.[weatherData.direction.length - 1]?.y;

  const formatTime = (ts) => {
    if (!ts) return '--:--:--';
    return new Date(ts).toLocaleTimeString(language, {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return language === 'sl'
      ? `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`
      : d.toLocaleDateString(language);
  };

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
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <h4 className="text-base font-medium text-[var(--text-sage)]">{t('weatherStation')}</h4>
        </div>
        {latest.timestamp && (
          <div className="text-right text-[10px] font-mono text-[var(--text-sage)] opacity-60">
            <div>{formatTime(latest.timestamp)}</div>
            <div>{formatDate(latest.timestamp)}</div>
          </div>
        )}
      </div>

      {/* 2×2 grid of indicators */}
      <div className="p-3 flex-grow min-h-0 grid grid-cols-2 gap-3 items-center">
        <WindCompassIndicator
          windDirection={lastDir ?? latest.wind_direction ?? null}
        />
        <WindSpeedIndicator
          windSpeed={latest.wind_speed ?? null}
          windGust={latest.wind_gust  ?? null}
        />
        <AirTemperatureIndicator
          airTemperature={latest.air_temperature ?? null}
        />
        <AirHumidityIndicator
          airHumidity={latest.air_humidity ?? null}
        />
      </div>
    </GlassCard>
  );
};

export default WeatherCard;
