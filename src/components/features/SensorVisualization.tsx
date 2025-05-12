import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
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
    <div className="space-y-4">
      <ReticulumDataSourceSelector />
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Soil Moisture Sensors</h3>
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            <p>Error loading sensor data</p>
            <button
              onClick={fetchSensorData}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              {t('sensors.description')}
            </p>
            <div className={isMobile ? "h-80" : "h-64"}>
              <Line data={getChartData()} options={options} />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{t('sensors.connectedDevices')}</h4>
                <span className="text-xs text-gray-500">4 {t('sensors.sensorsActive')} • {t('sensors.lastUpdate')}: {new Date().toLocaleTimeString()}</span>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-800">Samsung Galaxy</h5>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{t('sensors.online')}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {t('sensors.location')}: 46.075219, 14.480671 ({t('sensors.altitude')}: 363.2m) • {t('sensors.battery')}: 69%
                  </div>
                  <div className="space-y-2">
                    {sensorConfigs
                      .filter(config => config.deviceType === 'Samsung Galaxy')
                      .map(config => (
                        <div key={config.id} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
                          <div className="flex items-center">
                            <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: config.color }}></span>
                            <span className="text-sm font-medium text-gray-800">{config.name}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-600 pl-5">{config.description}</div>
                          <div className="mt-1 text-xs text-gray-500 pl-5">{t('sensors.location')}: {config.location}</div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-800">MacBook</h5>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{t('sensors.online')}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {t('sensors.location')}: Indoor • {t('sensors.lastUpdate')}: {new Date().toLocaleTimeString()}
                  </div>
                  <div className="space-y-2">
                    {sensorConfigs
                      .filter(config => config.deviceType === 'MacBook')
                      .map(config => (
                        <div key={config.id} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
                          <div className="flex items-center">
                            <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: config.color }}></span>
                            <span className="text-sm font-medium text-gray-800">{config.name}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-600 pl-5">{config.description}</div>
                          <div className="mt-1 text-xs text-gray-500 pl-5">{t('sensors.location')}: {config.location}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
