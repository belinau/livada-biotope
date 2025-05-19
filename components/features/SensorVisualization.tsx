'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Skeleton, 
  useTheme, 
  useMediaQuery, 
  IconButton,
  Tooltip,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Line } from 'react-chartjs-2';
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
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import SensorService, { DataSource, HistoricalDataPoint } from '@/lib/sensorService';

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

interface ConnectionStatus {
  isConnecting: boolean;
  error: string | null;
  connected: boolean;
}

interface SensorVisualizationProps {
  sensorId: string;
  title: string;
  height?: number | string;
  refreshInterval?: number;
  debug?: boolean;
  dataSource?: DataSource;
}

export default function SensorVisualization({ 
  sensorId, 
  title, 
  height = 400,
  refreshInterval = 5000,
  debug = false,
  dataSource: initialDataSource = DataSource.RETICULUM
}: SensorVisualizationProps) {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(initialDataSource);
  const [showDebug, setShowDebug] = useState(debug);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ 
    isConnecting: false,
    connected: false,
    error: null 
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const sensorService = useMemo(() => SensorService, []);

  // Initialize sensor service and set up data source
  useEffect(() => {
    const initialize = async () => {
      try {
        // Set the data source to Reticulum
        await sensorService.setDataSource(DataSource.RETICULUM);
        
        // Check connection status
        const status = sensorService.getConnectionStatus();
        setConnectionStatus(prev => ({
          ...prev,
          ...status,
          connected: !status.isConnecting && !status.error
        }));
        
        if (status.error) {
          setError(`Connection error: ${status.error}`);
          setSnackbarOpen(true);
        }
      } catch (err) {
        console.error('Error initializing sensor service:', err);
        setError(`Failed to initialize sensor service: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [sensorService]);

  const fetchSensorData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Ensure we're using Reticulum data source
      if (sensorService.getDataSource() !== DataSource.RETICULUM) {
        await sensorService.setDataSource(DataSource.RETICULUM);
      }
      
      // Get historical data for this sensor
      const history = await sensorService.getHistoricalData(sensorId);
      
      if (!history || history.length === 0) {
        setError('No data available from Reticulum bridge');
        return;
      }
      
      setData(history);
      setLastUpdated(new Date());
      
      // Update connection status
      const status = sensorService.getConnectionStatus();
      setConnectionStatus(prev => ({
        ...prev,
        ...status,
        connected: !status.isConnecting && !status.error
      }));
      
      if (status.error) {
        setError(`Connection error: ${status.error}`);
        setSnackbarOpen(true);
      }
      
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      setError(`Failed to load sensor data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [sensorId, sensorService]);

  // Initial data fetch
  useEffect(() => {
    if (connectionStatus.connected) {
      fetchSensorData();
    }
  }, [fetchSensorData, connectionStatus.connected]);

  // Set up polling
  useEffect(() => {
    if (!connectionStatus.connected) return;
    
    const intervalId = setInterval(fetchSensorData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchSensorData, refreshInterval, connectionStatus.connected]);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    fetchSensorData();
  }, [fetchSensorData]);

  // Toggle debug panel
  const toggleDebug = useCallback(() => {
    setShowDebug(prev => !prev);
  }, []);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Chart data and options
  const chartData: ChartData<'line'> = useMemo(() => {
    // Sort data by timestamp to ensure correct order
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    return {
      labels: sortedData.map(item => new Date(item.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: title,
          data: sortedData.map(item => item.value),
          borderColor: theme.palette.primary.main,
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: isMobile ? 2 : 4,
          pointHoverRadius: isMobile ? 4 : 6,
        },
      ],
    };
  }, [data, title, theme.palette.primary.main, isMobile]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: isMobile ? 14 : 16,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const timestamp = data[context.dataIndex]?.timestamp;
            const date = timestamp ? new Date(timestamp) : null;
            const timeStr = date ? date.toLocaleTimeString() : 'N/A';
            return `${context.dataset.label}: ${value} (${timeStr})`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
          font: {
            size: isMobile ? 12 : 14,
          },
        },
        grid: {
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
          font: {
            size: isMobile ? 12 : 14,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  }), [title, theme.palette.mode, isMobile, data]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        height, 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 2,
        textAlign: 'center',
      }}>
        <Typography variant="body1">Connecting to Reticulum bridge...</Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height }}>
      {/* Connection Status Indicator */}
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        left: 8, 
        zIndex: 10, 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.paper',
        px: 1,
        borderRadius: 1,
        border: `1px solid ${connectionStatus.connected ? 'success.main' : 'error.main'}`
      }}>
        <Box 
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: connectionStatus.connected ? 'success.main' : 'error.main'
          }} 
        />
        <Typography variant="caption" color="textSecondary">
          {connectionStatus.connected ? 'Connected' : 'Disconnected'}
        </Typography>
      </Box>

      {/* Debug Toggle Button */}
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, display: 'flex', gap: 1 }}>
        <Tooltip title={showDebug ? 'Hide Debug' : 'Show Debug'}>
          <IconButton 
            size="small" 
            onClick={toggleDebug}
            color={showDebug ? 'primary' : 'default'}
            sx={{
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <BugReportIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh Data">
          <IconButton 
            size="small" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <RefreshIcon fontSize="small" className={isRefreshing ? 'spin' : ''} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Chart */}
      <Box sx={{ 
        height: '100%', 
        width: '100%', 
        opacity: isRefreshing ? 0.7 : 1,
        transition: 'opacity 0.3s ease',
        p: 1
      }}>
        {data.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Box sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 2
          }}>
            <Typography variant="body1" color="textSecondary">
              {error ? error : 'No data available'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Debug Panel */}
      {showDebug && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            p: 2, 
            bgcolor: 'background.paper',
            borderTop: `1px solid ${theme.palette.divider}`,
            maxHeight: '40%',
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">Debug Information</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="textSecondary">
                {connectionStatus.connected ? 'Connected' : 'Disconnected'}
              </Typography>
              <Box 
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: connectionStatus.connected ? 'success.main' : 'error.main'
                }} 
              />
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <div><strong>Sensor ID:</strong> {sensorId}</div>
            <div><strong>Data Points:</strong> {data.length}</div>
            <div><strong>Last Updated:</strong> {lastUpdated?.toLocaleTimeString() || 'Never'}</div>
            <div><strong>Refresh Rate:</strong> {refreshInterval / 1000}s</div>
            <div><strong>Data Source:</strong> Reticulum Bridge</div>
            {connectionStatus.error && (
              <div><strong>Error:</strong> {connectionStatus.error}</div>
            )}
            <Divider sx={{ my: 1 }} />
            <div><strong>Latest Values:</strong></div>
            {data.length > 0 ? (
              data.slice(-5).map((point, i) => (
                <div key={i}>
                  {new Date(point.timestamp).toLocaleTimeString()}: {point.value.toFixed(2)}
                </div>
              ))
            ) : (
              <div>No data available</div>
            )}
          </Box>
        </Paper>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Add some basic styles for the refresh animation */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </Box>
  );
}
