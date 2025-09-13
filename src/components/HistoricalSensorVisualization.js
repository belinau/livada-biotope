import React from 'react';
import EnhancedHistoricalVisualization from './EnhancedHistoricalVisualization';

// Export the new enhanced visualization as the default component
export default function HistoricalSensorVisualization() {
    return <EnhancedHistoricalVisualization />;
}

// Also export the context for backward compatibility
export { HistoricalSensorContext } from './EnhancedHistoricalVisualization';