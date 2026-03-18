import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { useTranslation } from '../context/LanguageContext';

/**
 * PaxCard Component - matches BedCard/WindCard styling exactly
 */
const PaxCard = ({ paxData, t }) => {
    const { t: translateT } = useTranslation();
    const translate = t || translateT;
    
    const wifiCount = paxData?.wifi ?? null;
    const bleCount = paxData?.ble ?? null;
    const totalCount = (wifiCount !== null && bleCount !== null) ? wifiCount + bleCount : null;

    return (
        <GlassCard className="flex flex-col h-full" padding="p-0" rounded="xl">
            {/* Header - matches BedCard header */}
            <div className="p-3 flex justify-between items-center bg-gradient-to-t" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary)dd)', color: 'var(--text-sage)' }}>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--text-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h4 className="text-[var(--text-sage)] text-base" style={{ fontWeight: '500' }}>{translate('paxCounter')}</h4>
                </div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
            
            {/* Content - matches BedCard content style */}
            <div className="p-3 space-y-3 flex-grow min-h-0">
                {/* WiFi devices */}
                <div className="flex justify-between items-center">
                    <div className="text-[var(--text-sage)] font-medium text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{translate('paxWifi')}</div>
                    <div className="text-xl font-mono font-bold text-[var(--text-sage)]">
                        {wifiCount !== null ? wifiCount : '—'}
                    </div>
                </div>
                
                {/* BLE devices */}
                <div className="flex justify-between items-center">
                    <div className="text-[var(--text-sage)] font-medium text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{translate('paxBle')}</div>
                    <div className="text-xl font-mono font-bold text-[var(--text-sage)]">
                        {bleCount !== null ? bleCount : '—'}
                    </div>
                </div>
                
                {/* Total devices */}
                <div className="flex justify-between items-center">
                    <div className="text-[var(--text-sage)] font-medium text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{translate('paxTotal')}</div>
                    <div className="text-xl font-mono font-bold text-[var(--text-sage)]">
                        {totalCount !== null ? totalCount : '—'}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default PaxCard;
