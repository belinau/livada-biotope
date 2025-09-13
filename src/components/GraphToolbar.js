import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { GlassCard } from './ui/GlassCard';

const GraphToolbar = ({ onZoomIn, onZoomOut, onPanLeft, onPanRight, onReset, onExport }) => {
    const { t } = useTranslation();
    
    return (
        <GlassCard className="p-3 rounded-xl border border-[var(--glass-border)] backdrop-blur-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <button
                    onClick={onZoomIn}
                    className="p-2 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)]"
                    title={t('zoomIn')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
                <button
                    onClick={onZoomOut}
                    className="p-2 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)]"
                    title={t('zoomOut')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                </button>
                <div className="h-5 w-px bg-[var(--glass-border)]"></div>
                <button
                    onClick={onPanLeft}
                    className="p-2 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)]"
                    title={t('panLeft')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={onPanRight}
                    className="p-2 bg-[var(--glass-bg-nav)] text-text-main rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)]"
                    title={t('panRight')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={onReset}
                    className="px-3 py-2 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)] text-sm flex items-center gap-1"
                    title={t('resetView')}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m7 7v-5h-5m9-2a8.96 8.96 0 00-12.065-5.565m-2.87 5.565a8.96 8.96 0 0012.065 5.565" />
                    </svg>
                    {t('reset')}
                </button>
                <div className="relative group">
                    <button
                        className="px-3 py-2 bg-[var(--glass-bg-nav)] text-text-main font-medium rounded-lg hover:bg-primary/20 transition-all duration-200 border border-[var(--glass-border)] text-sm flex items-center gap-1"
                        title={t('export')}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t('export')}
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button
                            onClick={() => onExport('png')}
                            className="block w-full text-left px-4 py-2 text-sm text-text-main hover:bg-primary/20 transition-colors"
                        >
                            {t('exportAsPNG')}
                        </button>
                        <button
                            onClick={() => onExport('jpg')}
                            className="block w-full text-left px-4 py-2 text-sm text-text-main hover:bg-primary/20 transition-colors"
                        >
                            {t('exportAsJPG')}
                        </button>
                        <button
                            onClick={() => onExport('pdf')}
                            className="block w-full text-left px-4 py-2 text-sm text-text-main hover:bg-primary/20 transition-colors"
                        >
                            {t('exportAsPDF')}
                        </button>
                        <button
                            onClick={() => onExport('csv')}
                            className="block w-full text-left px-4 py-2 text-sm text-text-main hover:bg-primary/20 transition-colors"
                        >
                            {t('exportAsCSV')}
                        </button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default GraphToolbar;