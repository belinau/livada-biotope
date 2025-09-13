import React from 'react';
import { motion } from 'framer-motion';
import { getTextClasses, getTextStyle } from './typography-utils';
import { getGlassVariant } from './glass-theme';

const MetricCard = ({ label, value, unit = '', decimals = 0 }) => {
    const isValid = typeof value === 'number' && !isNaN(value);
    const displayValue = isValid ? value.toFixed(decimals) : '--';
    
    // Define vibrant color schemes for different metrics
    const getColorScheme = () => {
        if (label.includes('vlaga')) {
            // Blue/violet scheme for humidity
            return 'from-blue-400/30 to-violet-500/30';
        } else if (label.includes('temperatura')) {
            // Orange/red scheme for temperature
            return 'from-orange-400/30 to-red-500/30';
        } else {
            // Default green scheme
            return 'from-green-400/30 to-emerald-500/30';
        }
    };
    
    return (
        <motion.div
            className={`p-4 text-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${getColorScheme()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <div className={getTextStyle('display', { size: '2xl', color: 'primary' })}>
                {displayValue}
                <span className={`${getTextClasses({ fontFamily: 'accent', size: 'base', color: 'muted' })} ml-1`}>
                    {unit}
                </span>
            </div>
            <div className={`${getTextClasses({ fontFamily: 'accent', size: 'xs', color: 'muted', letterSpacing: 'wider' })} uppercase tracking-wider font-bold mt-1`}>
                {label}
            </div>
        </motion.div>
    );
};

export default MetricCard;