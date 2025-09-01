import React from 'react';
import { GlassCard } from './ui/GlassCard';

const ChartWrapper = ({ title, children }) => (
    <GlassCard className="flex flex-col min-h-[400px]" padding="p-4 sm:p-6" rounded="xl">
        <div className="flex items-center justify-center mb-4">
            <h4 className="heading-playful text-lg text-center px-4 py-2 bg-gradient-to-r from-bg-main to-bg-main rounded-full border border-border-color shadow-sm">{title}</h4>
        </div>
        <div className="flex-grow relative overflow-hidden">{children}</div>
    </GlassCard>
);

export default ChartWrapper;
