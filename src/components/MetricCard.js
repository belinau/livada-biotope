import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ label, value, unit = '', decimals = 0 }) => {
    const isValid = typeof value === 'number' && !isNaN(value);
    const displayValue = isValid ? value.toFixed(decimals) : '--';
    return (
        <motion.div
            className="bg-bg-main/70 p-3 rounded-md text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-display text-2xl text-primary">{displayValue}<span className="text-accent text-base text-text-muted ml-1">{unit}</span></div>
            <div className="text-accent text-xs text-text-muted uppercase tracking-wider">{label}</div>
        </motion.div>
    );
};

export default MetricCard;
