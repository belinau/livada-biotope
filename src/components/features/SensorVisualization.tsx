/**
 * SensorVisualization Component
 * 
 * A reusable component for displaying sensor data in a line chart format. It connects to the Reticulum bridge
 * to fetch real-time sensor data and visualizes it using Chart.js. The component handles loading states,
 * error states, and provides a responsive chart visualization.
 */

'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  useTheme, 
  useMediaQuery, 
  Alert, 
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface SensorDataPoint {
  timestamp: string;
  value: number;
}

interface SensorVisualizationProps {
  sensorId: string | number;
  title?: string;
  height?: number | string;
  refreshInterval?: number;
  dataSource?: 'reticulum' | 'mock';
  onError?: (error: Error) => void;
}

const SensorVisualization: React.FC<SensorVisualizationProps> = ({
  sensorId,
  title = 'Sensor Data',
  height = 400,
  refreshInterval = 30000, // 30 seconds
  dataSource = 'reticulum',
  onError
}) => {
  const [data, setData] = useState<SensorDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchSensorData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/sensors/${sensorId}/data`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          `Failed to fetch sensor data (${response.status} ${response.statusText})`
        );
      }
      
      const result = await response.json();
      setData(Array.isArray(result) ? result : [result]);
      setLastUpdated(new Date());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching sensor data:', err);
      
      // Notify parent component of error if handler is provided
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  }, [sensorId, onError]);

  // Effect for initial fetch and polling
  useEffect(() => {
    // Initial fetch
    fetchSensorData();

    // Set up polling if refreshInterval is greater than 0
    let intervalId: NodeJS.Timeout | null = null;
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchSensorData, refreshInterval);
    }

    // Clean up
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchSensorData, refreshInterval]);

  // Chart data and options
  const chartData = useMemo<ChartData<'line'>>(() => ({
    labels: data.map((item) => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: title,
        data: data.map((item) => item.value),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '80',
        tension: 0.4,
        fill: true,
        pointRadius: isMobile ? 2 : 4,
        pointHoverRadius: isMobile ? 4 : 6,
      },
    ],
  }), [data, title, theme.palette.primary, isMobile]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.dataset.label}: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  }), [theme.palette.divider]);

  // Loading state
  if (isLoading && data.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Loading sensor data...
        </Typography>
      </Box>
    );
  }


  // Error state
  if (error) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          bgcolor: theme.palette.error.light + '20', // Use light error color with opacity
          border: `1px solid ${theme.palette.error.light}`,
          borderRadius: 2,
        }}
      >
        <ErrorOutlineIcon 
          color="error" 
          sx={{ fontSize: 48, mb: 2 }} 
        />
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load sensor data
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={fetchSensorData}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  // No data state
  if (data.length === 0) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No data available
        </Typography>
        <Button
          variant="outlined"
          onClick={fetchSensorData}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
      </Box>
    );
  }

  // Main chart view
  return (
    <Box sx={{ position: 'relative', height }}>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          zIndex: 1,
          display: 'flex',
          gap: 1,
          alignItems: 'center'
        }}
      >
        {lastUpdated && (
          <Tooltip title={`Last updated: ${lastUpdated.toLocaleTimeString()}`}>
            <Typography 
              variant="caption" 
              color="textSecondary"
              sx={{ 
                fontSize: '0.7rem',
                opacity: 0.7,
                whiteSpace: 'nowrap'
              }}
            >
              Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Tooltip>
        )}
        <Tooltip title="Refresh data">
          <IconButton 
            size="small" 
            onClick={fetchSensorData}
            disabled={isLoading}
            sx={{
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                bgcolor: 'action.hover'
              }
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Line 
        data={chartData} 
        options={chartOptions} 
      />
      
      {isLoading && (
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default SensorVisualization;