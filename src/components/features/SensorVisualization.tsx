import React from 'react';
import { Box, Typography, Paper, Chip, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  timestamp: string;
}

interface SensorVisualizationProps {
  data: SensorData;
  loading?: boolean;
  error?: string | null;
}

const SensorVisualization: React.FC<SensorVisualizationProps> = ({
  data,
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading sensor data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Error loading sensor data: {error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Sensor Data
        </Typography>
        <Tooltip title="Real-time sensor data from the garden">
          <IconButton size="small">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        <SensorMetric 
          label="Temperature" 
          value={`${data.temperature}°C`} 
          color="#ff6b6b"
        />
        <SensorMetric 
          label="Humidity" 
          value={`${data.humidity}%`} 
          color="#4dabf7"
        />
        <SensorMetric 
          label="Soil Moisture" 
          value={`${data.soilMoisture}%`} 
          color="#7950f2"
        />
        <SensorMetric 
          label="Light Intensity" 
          value={`${data.lightIntensity} lux`} 
          color="#ffd43b"
        />
      </Box>
      <Box mt={2}>
        <Chip 
          label={`Last updated: ${new Date(data.timestamp).toLocaleString()}`} 
          size="small"
          variant="outlined"
        />
      </Box>
    </Paper>
  );
};

interface SensorMetricProps {
  label: string;
  value: string;
  color: string;
}

const SensorMetric: React.FC<SensorMetricProps> = ({ label, value, color }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 1,
      borderLeft: `4px solid ${color}`,
      bgcolor: 'background.paper',
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);

export default SensorVisualization;