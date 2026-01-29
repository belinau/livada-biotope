import React, { useState, useMemo } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { GlassCard } from './ui/GlassCard';

const DateRangeControls = ({ 
    startDate, 
    endDate, 
    onDateChange,
    granularity = 'daily',
    onGranularityChange
}) => {
    const { t } = useTranslation();
    const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(formatDateForInput(startDate));
    const [tempEndDate, setTempEndDate] = useState(formatDateForInput(endDate));
    
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
        },
        { 
            id: '90days', 
            label: t('last90Days'), 
            getRange: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 90);
                return { start, end };
            }
        },
        { 
            id: '6months', 
            label: t('last6Months'), 
            getRange: () => {
                const end = new Date();
                const start = new Date();
                start.setMonth(end.getMonth() - 6);
                return { start, end };
            }
        }
    ], [t]);

    // Format dates for input fields
    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

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

    return (
        <GlassCard className="p-4 sm:p-6 rounded-xl border border-[var(--glass-border)] backdrop-blur-sm w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Preset Buttons */}
                <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset)}
                            className="px-3 py-2 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)] text-sm"
                        >
                            {preset.label}
                        </button>
                    ))}
                    <button
                        onClick={() => setIsCustomRangeOpen(!isCustomRangeOpen)}
                        className="px-3 py-2 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)] text-sm flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t('customRange')}
                    </button>
                </div>

                {/* Granularity Selector */}
                <div className="flex items-center gap-2">
                    <label className="text-text-main text-sm font-medium">{t('granularity')}:</label>
                    <select
                        value={granularity}
                        onChange={(e) => onGranularityChange(e.target.value)}
                        className="px-3 py-2 bg-[var(--glass-bg)] text-text-main border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    >
                        <option value="raw">{t('raw')}</option>
                        <option value="hourly">{t('hourly')}</option>
                        <option value="daily">{t('daily')}</option>
                        <option value="weekly">{t('weekly')}</option>
                        <option value="monthly">{t('monthly')}</option>
                    </select>
                </div>
            </div>

            {/* Custom Date Range Picker with glassmorphic styling */}
            {isCustomRangeOpen && (
                <GlassCard className="mt-6 p-4 rounded-xl border border-[var(--glass-border)] backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-text-main text-sm font-medium">{t('startDate')}</label>
                            <input
                                type="date"
                                value={tempStartDate}
                                onChange={(e) => setTempStartDate(e.target.value)}
                                className="px-3 py-2 bg-[var(--glass-bg)] text-text-main border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-text-main text-sm font-medium">{t('endDate')}</label>
                            <input
                                type="date"
                                value={tempEndDate}
                                onChange={(e) => setTempEndDate(e.target.value)}
                                className="px-3 py-2 bg-[var(--glass-bg)] text-text-main border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setIsCustomRangeOpen(false)}
                            className="px-4 py-2 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all duration-200 border border-[var(--glass-border)]"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleApplyCustomRange}
                            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all duration-200"
                        >
                            {t('apply')}
                        </button>
                    </div>
                </GlassCard>
            )}

            {/* Current Range Display */}
            <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-text-main text-sm">
                            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </span>
                    </div>
                    <span className="text-text-muted text-sm">
                        ({Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} {t('days')})
                    </span>
                </div>
                <button
                    onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(end.getDate() - 7);
                        onDateChange(start, end);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)] text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                    </svg>
                    {t('refresh')}
                </button>
            </div>
        </GlassCard>
    );
};

export default DateRangeControls;