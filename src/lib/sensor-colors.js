// Unified color mapping for sensors across the application
export const SENSOR_COLORS = {
  // Soil moisture - blue theme
  moisture: {
    waveBase: [100, 30, 180],
    waveHighlight: [160, 70, 240],
    line: 'var(--sensor-moisture)', // Violet
    name: 'moisture'
  },
  
  // Soil temperature - orange theme
  temperature: {
    waveBase: [255, 165, 0],
    waveHighlight: [255, 140, 0],
    line: 'var(--sensor-temperature)', // Warm orange
    name: 'temperature'
  },
  
  // Air humidity - green theme
  airHumidity: {
    waveBase: [135, 169, 107],
    waveHighlight: [150, 255, 200],
    line: 'var(--text-sage)', // Sage green
    name: 'airHumidity'
  },
  
  // Air temperature - light orange theme
  airTemperature: {
    waveBase: [235, 200, 100],
    waveHighlight: [255, 215, 120],
    line: 'var(--text-orange)', // Light orange
    name: 'airTemperature'
  }
};

// Color mapping for beds
export const BED_COLORS = {
  '!1641e779-0': 'var(--primary)', // primary - travnati sestoj
  '!1641e779-1': 'var(--text-sage)',   // text-sage - sivka in melisa
  
  '!04c5ad60-0': 'var(--primary-light)',    // primary-light - barjansko rastje
  '!04c5ad60-1': 'var(--border-color)', // border-color - cvetlice za opraševalce
  
  '!76208ba5-0': 'var(--text-sage)',    // text-sage - majaron in melisa
  '!76208ba5-1': 'var(--primary-light)',    // primary-light - tolščak in slezenovec
};

// Utility function to get color for a specific bed and metric
export const getSensorColor = (bedId, metricType) => {
  // For air metrics, use consistent colors regardless of bed
  if (metricType === 'airHumidity' || metricType === 'airTemperature') {
    return SENSOR_COLORS[metricType]?.line || '#76e4f7';
  }
  
  // For soil metrics, use bed-specific colors
  if (SENSOR_COLORS[metricType]) {
    return SENSOR_COLORS[metricType].line;
  }
  
  // Fallback to bed color if metric type not found
  return BED_COLORS[bedId] || '#76e4f7';
};

// Utility function to get wave colors for live sensors
export const getWaveColors = (metricType) => {
  const colors = SENSOR_COLORS[metricType] || SENSOR_COLORS.moisture;
  return {
    base: colors.waveBase,
    wave: colors.waveHighlight
  };
};

const sensorColors = {
  SENSOR_COLORS,
  BED_COLORS,
  getSensorColor,
  getWaveColors
};

export default sensorColors;