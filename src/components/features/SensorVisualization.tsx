import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Box, Typography, Paper, CircularProgress, Button, Alert, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
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
  const { t } = useLanguage();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.MOCK);
  const [sidebandHash, setSidebandHash] = useState<string>('a3641ddf337fcb827bdc092a4d9fd9de');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSensorData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SensorService.getInstance().getSensorData();
      setSensorData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Error fetching sensor data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSensorData();
    
    // Set up a timer to fetch data every 30 seconds
    // This is more frequent for demo purposes - in production you might want to use a longer interval
    const timer = setInterval(fetchSensorData, 30 * 1000);

    return () => clearInterval(timer);
  }, [fetchSensorData]);

  const getChartData = () => {
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
        tension: 0.1,
        fill: false
      }))
    };
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
        labels: {
          // Reduce font size on mobile
          font: {
            size: isMobile ? 10 : 12
          },
          boxWidth: isMobile ? 10 : 40
        }
      },
      title: {
        display: true,
        text: t('sensors.title'),
        font: {
          size: isMobile ? 14 : 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const sensorId = context.datasetIndex + 1;
            const sensor = sensorConfigs.find(s => s.id === sensorId);
            let label = context.dataset.label || '';
            let value = context.parsed.y;
            
            // For mobile, shorten the label
            if (isMobile && label.length > 15) {
              label = label.substring(0, 15) + '...';
            }
            
            if (sensor) {
              if (sensor.name.includes('Temperature')) {
                return `${label}: ${value.toFixed(1)}°C`;
              } else if (sensor.name.includes('Humidity') || sensor.name.includes('Moisture')) {
                return `${label}: ${value.toFixed(1)}%`;
              } else if (sensor.name.includes('Light')) {
                return `${label}: ${value.toFixed(1)}% intensity`;
              }
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const,
          // Display fewer ticks on mobile
          stepSize: isMobile ? 2 : 1
        },
        title: {
          display: !isMobile, // Hide title on mobile
          text: 'Time'
        },
        ticks: {
          maxRotation: isMobile ? 45 : 0,
          font: {
            size: isMobile ? 8 : 12
          },
          // Show fewer ticks on mobile
          maxTicksLimit: isMobile ? 5 : 10
        }
      },
      y: {
        title: {
          display: !isMobile, // Hide title on mobile
          text: 'Sensor Values'
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: isMobile ? 25 : 20,
          font: {
            size: isMobile ? 8 : 12
          }
        }
      },
    },
  };

  return (
    <Box sx={{ mb: 4 }}>
      <ReticulumDataSourceSelector />
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary' }}>Soil Moisture Sensors</Typography>
          {lastUpdated && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>Error loading sensor data</Alert>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchSensorData}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              {t('sensors.description') || 'Real-time soil moisture data from our sensor network at Livada Biotope.'}
            </Typography>
            <Box sx={{ height: isMobile ? 320 : 260, mb: 2 }}>
              <Line data={getChartData()} options={options} />
            </Box>
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>{t('sensors.connectedDevices') || 'Connected Devices'}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>4 {t('sensors.sensorsActive') || 'sensors active'} • {t('sensors.lastUpdate') || 'Last update'}: {new Date().toLocaleTimeString()}</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">Samsung Galaxy</Typography>
                      <Box sx={{ px: 1, py: 0.5, bgcolor: 'success.light', color: 'success.dark', borderRadius: 10, fontSize: '0.75rem' }}>
                        {t('sensors.online') || 'Online'}
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                      {t('sensors.location') || 'Location'}: 46.075219, 14.480671 ({t('sensors.altitude') || 'Altitude'}: 363.2m) • {t('sensors.battery') || 'Battery'}: 69%
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {sensorConfigs
                        .filter(config => config.deviceType === 'Samsung Galaxy')
                        .map(config => (
                          <Paper key={config.id} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 12, height: 12, borderRadius: '50%', mr: 1, bgcolor: config.color }} />
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{config.name}</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, ml: 3 }}>{config.description}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, ml: 3 }}>{t('sensors.location') || 'Location'}: {config.location}</Typography>
                          </Paper>
                        ))}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">MacBook Pro</Typography>
                      <Box sx={{ px: 1, py: 0.5, bgcolor: 'success.light', color: 'success.dark', borderRadius: 10, fontSize: '0.75rem' }}>
                        {t('sensors.online') || 'Online'}
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                      {t('sensors.location') || 'Location'}: 46.075219, 14.480671 ({t('sensors.altitude') || 'Altitude'}: 363.2m) • {t('sensors.battery') || 'Battery'}: 87%
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {sensorConfigs
                        .filter(config => config.deviceType === 'MacBook Pro')
                        .map(config => (
                          <Paper key={config.id} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 12, height: 12, borderRadius: '50%', mr: 1, bgcolor: config.color }} />
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{config.name}</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, ml: 3 }}>{config.description}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, ml: 3 }}>{t('sensors.location') || 'Location'}: {config.location}</Typography>
                          </Paper>
                        ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};
