import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Box, Typography, Paper, CircularProgress, Button, Alert, Grid, Chip, Snackbar } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { sensorConfigs } from '@/lib/sensorConfig';
import { SensorService, DataSource } from '@/lib/sensorService';
import { ReticulumDataSourceSelector } from './ReticulumDataSourceSelector';
import { useLanguage } from '../../contexts/LanguageContext';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface SensorData {
  timestamp: string;
  sensorId: number;
  moisture: number;
}

export const SensorVisualization: React.FC = () => {
  // Use a more reliable approach for translations
  const defaultTranslations = {
    'sensors.title': 'Soil Moisture Monitoring',
    'sensors.description': 'Real-time soil moisture data from our sensor network at Livada Biotope.',
    'sensors.connectedDevices': 'Connected Devices',
    'sensors.sensorsActive': 'sensors active',
    'sensors.lastUpdate': 'Last update',
    'sensors.online': 'Online',
    'sensors.offline': 'Offline',
    'sensors.unknown': 'Unknown',
    'sensors.location': 'Location',
    'sensors.altitude': 'Altitude',
    'sensors.battery': 'Battery',
    'sensors.refreshData': 'Refresh Data',
    'sensors.testConnection': 'Test Connection',
    'sensors.mockData': 'Using Demo Data',
    'sensors.liveData': 'Using Live Data'
  };
  
  const t = (key: string) => defaultTranslations[key as keyof typeof defaultTranslations] || key;
  
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.MOCK);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionTesting, setConnectionTesting] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'info' });
  
  // Function to generate fallback data if API calls fail
  const generateFallbackData = () => {
    const now = new Date();
    const data: SensorData[] = [];
    
    // Generate fallback data for the last 24 hours
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      
      // Generate data for only 2 sensors to prevent duplication
      for (let sensorId = 1; sensorId <= 2; sensorId++) {
        // Create realistic-looking moisture levels with daily patterns
        // Morning is drier, evening is more humid
        const hour = 23 - i; // Current hour in reverse (0-23)
        let baseMoisture = 40; // Average moisture level
        
        // Add time-based variation
        const timeVariation = Math.sin((hour / 24) * Math.PI * 2) * 10;
        // Add random noise
        const noise = Math.random() * 5 - 2.5;
        
        // Calculate moisture with different patterns for each sensor
        let moisture;
        if (sensorId === 1) {
          moisture = Math.max(15, Math.min(85, baseMoisture + timeVariation + noise));
        } else {
          moisture = Math.max(10, Math.min(90, (baseMoisture - 10) - timeVariation + noise));
        }
        
        data.push({
          timestamp: time.toISOString(),
          sensorId,
          moisture
        });
      }
    }
    
    return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };
  
  // Test Sideband connection
  const testConnection = async () => {
    setConnectionTesting(true);
    try {
      const response = await fetch('/api/sideband/test-connection');
      const result = await response.json();
      
      if (result.success) {
        setConnectionStatus('connected');
        setError(null);
        // Show success snackbar
        setSnackbar({ open: true, message: 'Connection successful! Connected to Sideband bridge service', severity: 'success' });
      } else {
        setConnectionStatus('disconnected');
        setError(result.message || 'Failed to connect to Sideband');
        // Show error snackbar
        setSnackbar({ open: true, message: `Connection failed! ${result.message || 'Unable to connect to Sideband bridge'}`, severity: 'error' });
      }
    } catch (err) {
      setConnectionStatus('disconnected');
      setError('Connection test failed. Server may be unavailable.');
      // Show error snackbar
      setSnackbar({ open: true, message: 'Connection error! Error testing connection to Sideband bridge', severity: 'error' });
    } finally {
      setConnectionTesting(false);
    }
  };
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setChartError(false);
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Data fetch timeout'));
        }, 8000); // 8 second timeout
      });
      
      // Race between actual fetch and the timeout
      try {
        const data = await Promise.race([
          SensorService.getInstance().getSensorData(),
          timeoutPromise
        ]) as SensorData[];
        
        if (data && data.length > 0) {
          setSensorData(data);
          setLastUpdated(new Date());
          
          // Update connection status based on data source
          const service = SensorService.getInstance();
          if (service.getDataSource() === DataSource.RETICULUM) {
            const status = service.getConnectionStatus();
            setConnectionStatus(status.isConnecting ? 'unknown' : (status.error ? 'disconnected' : 'connected'));
            if (status.error) {
              setError(`Warning: ${status.error}. Using cached or demo data.`);
            } else {
              setError(null);
            }
          } else {
            setConnectionStatus('unknown'); // Not applicable for mock data
          }
        } else {
          throw new Error('No data available');
        }
      } catch (err) {
        throw err; // Re-throw to be caught by outer try/catch
      }
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      setError(`${err instanceof Error ? err.message : 'Failed to fetch sensor data'}. Showing demo data instead.`);
      // Generate fallback data
      const fallbackData = generateFallbackData();
      setSensorData(fallbackData);
      setLastUpdated(new Date());
      // Update connection status to disconnected
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleDataSourceChange = async (source: DataSource) => {
    try {
      setLoading(true);
      setError(null);
      
      // Set the data source in the service
      await SensorService.getInstance().setDataSource(source);
      setDataSource(source);
      
      // Fetch fresh data with the new source
      await fetchData();
      
      // Update connection status
      if (source === DataSource.RETICULUM) {
        const status = SensorService.getInstance().getConnectionStatus();
        setConnectionStatus(status.isConnecting ? 'unknown' : (status.error ? 'disconnected' : 'connected'));
      } else {
        setConnectionStatus('unknown'); // Not relevant for mock data
      }
    } catch (err) {
      console.error('Error changing data source:', err);
      setError(`Failed to switch data source: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on initial load
  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh interval (every 5 minutes)
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getChartData = () => {
    try {
      // Make sure we have valid data
      if (!sensorData || sensorData.length === 0) {
        return {
          datasets: []
        };
      }
      
      return {
        datasets: sensorConfigs.map(config => ({
          label: `${config.name} (${config.location})`,
          data: sensorData
            .filter(data => data.sensorId === config.id)
            .map(data => ({
              x: new Date(data.timestamp),
              y: data.moisture
            })),
          borderColor: config.color,
          backgroundColor: config.color + '33', // Add transparency
          tension: 0.1,
          fill: false,
          pointRadius: 2,
          pointHoverRadius: 5
        }))
      };
    } catch (error) {
      console.error('Error creating chart data:', error);
      setChartError(true);
      return { datasets: [] };
    }
  };

  // Use window.innerWidth to determine if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: !isMobile
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const,
          displayFormats: {
            hour: 'MMM d, H:mm'
          }
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Moisture Level (%)'
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
          {t('sensors.connectedDevices')}
          <Chip 
            label={sensorConfigs.length + ' ' + t('sensors.sensorsActive')} 
            size="small" 
            color="primary" 
            sx={{ ml: 1 }} 
          />
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Connection Status Indicator */}
          <Chip
            icon={
              connectionStatus === 'connected' ? <WifiIcon /> : 
              connectionStatus === 'disconnected' ? <WifiOffIcon /> : 
              <HelpOutlineIcon />
            }
            label={
              connectionStatus === 'connected' ? t('sensors.online') : 
              connectionStatus === 'disconnected' ? t('sensors.offline') : 
              t('sensors.unknown')
            }
            color={
              connectionStatus === 'connected' ? 'success' : 
              connectionStatus === 'disconnected' ? 'error' : 
              'default'
            }
            sx={{ mr: 1 }}
          />
          
          {/* Data Source Indicator */}
          <Chip
            label={dataSource === DataSource.MOCK ? t('sensors.mockData') : t('sensors.liveData')}
            color={dataSource === DataSource.MOCK ? 'default' : 'primary'}
            size="small"
            sx={{ mr: 1 }}
          />
          
          {/* Test Connection Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={testConnection}
            disabled={connectionTesting || loading}
            sx={{ mr: 1 }}
          >
            {connectionTesting ? <CircularProgress size={20} /> : t('sensors.testConnection')}
          </Button>
          
          {/* Refresh Button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => fetchData()}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
          >
            {t('sensors.refreshData')}
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Data Source Selector */}
      <ReticulumDataSourceSelector
        dataSource={dataSource}
        onDataSourceChange={handleDataSourceChange}
        sx={{ mb: 2 }}
      />
      
      {/* Last Updated */}
      {lastUpdated && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('sensors.lastUpdate')}: {lastUpdated.toLocaleString()}
        </Typography>
      )}
      
      {/* Chart Container */}
      <Box sx={{ height: 400, position: 'relative' }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}>
            <CircularProgress />
          </Box>
        ) : chartError ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}>
            <Typography color="error">
              Error displaying chart. Please try again.
            </Typography>
          </Box>
        ) : (
          <Line options={options} data={getChartData()} />
        )}
      </Box>
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

// This component is already exported with 'export const' above
// No default export needed