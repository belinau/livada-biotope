export interface SensorConfig {
  id: number;
  name: string;
  location: string;
  color: string;
  deviceType: string;
  description?: string;
}

export const sensorConfigs: SensorConfig[] = [
  {
    id: 1,
    name: 'Acceleration Sensor',
    location: 'Garden Bed 1',
    color: '#4CAF50',
    deviceType: 'Samsung Galaxy',
    description: 'Measures soil moisture based on acceleration data'
  },
  {
    id: 2,
    name: 'Ambient Light Sensor',
    location: 'Garden Bed 1',
    color: '#FFC107',
    deviceType: 'Samsung Galaxy',
    description: 'Measures light intensity in lux'
  },
  {
    id: 3,
    name: 'Temperature Sensor',
    location: 'Indoor',
    color: '#FF5722',
    deviceType: 'MacBook',
    description: 'Measures ambient temperature'
  },
  {
    id: 4,
    name: 'Humidity Sensor',
    location: 'Indoor',
    color: '#2196F3',
    deviceType: 'MacBook',
    description: 'Measures relative humidity'
  }
];
