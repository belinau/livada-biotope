import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  CircularProgress, 
  Alert, 
  Snackbar,
  SxProps,
  Theme,
  Tooltip,
  IconButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface DataSource {
  id: string;
  name: string;
  endpoint: string;
  type: string;
}

// Register ChartJS components
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  TimeScale
);

interface SensorData {
  timestamp: string;
  value: number;
}

interface SensorVisualizationProps {
  dataSource: DataSource;
  onDataSourceChange?: (source: DataSource) => Promise<void>;
  sx?: SxProps<Theme>;
}

export const SensorVisualization: React.FC<SensorVisualizationProps> = ({
  dataSource,
  onDataSourceChange = async () => { /* no-op */ },
  sx = {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch sensor data when data source changes
  useEffect(() => {
    const fetchData = async () => {
      if (!dataSource?.endpoint) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(dataSource.endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSensorData(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error fetching sensor data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sensor data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling
    const interval = setInterval(fetchData, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, [dataSource.endpoint]);
  
  // Format data for chart
  const chartData = {
    labels: sensorData.map(item => new Date(item.timestamp)),
    datasets: [
      {
        label: 'Sensor Value',
        data: sensorData.map(item => item.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  };

  return (
    <Box sx={{ ...sx }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Sensor Data Visualization
          </Typography>
          <Box>
            {lastUpdated && (
              <Chip 
                label={`Last updated: ${lastUpdated.toLocaleTimeString()}`}
                size="small"
                variant="outlined"
                sx={{ mr: 1 }}
              />
            )}
            <Tooltip title="Data is automatically refreshed every minute">
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" color="action" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : sensorData.length === 0 ? (
          <Alert severity="info">
            No sensor data available. Please select a data source.
          </Alert>
        ) : (
          <Box sx={{ height: 400 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </Paper>
      
      <Snackbar 
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Box>
  );
};

export default SensorVisualization;