import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { useTranslation } from '../context/LanguageContext';
import PaxIndicator from './sensor-indicators/PaxIndicator';

/**
 * PaxCard
 *
 * Data shape:
 *   paxData = { wifi: number|null, ble: number|null, lastUpdated: Date|null }
 */
const PaxCard = ({ paxData, t: tProp }) => {
  const { t: tCtx, language } = useTranslation();
  const t = tProp || tCtx;

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString(language, {
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h4 className="text-base font-medium text-[var(--text-sage)]">{t('paxCounter')}</h4>
        </div>
        {paxData?.lastUpdated && (
          <div className="text-[10px] font-mono text-[var(--text-sage)] opacity-55">
            {formatTime(paxData.lastUpdated)}
          </div>
        )}
      </div>

      {/* Indicator — wider canvas fits the card */}
      <div className="p-3 flex-grow min-h-0 flex items-center justify-center">
        <PaxIndicator
          wifi={paxData?.wifi ?? null}
          ble={paxData?.ble  ?? null}
          lastUpdated={paxData?.lastUpdated ?? null}
        />
      </div>
    </GlassCard>
  );
};

export default PaxCard;
