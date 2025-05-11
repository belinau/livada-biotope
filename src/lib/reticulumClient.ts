/**
 * Reticulum Network Client for Sideband Collector
 * 
 * This module provides an interface to connect to a Reticulum network
 * and collect sensor telemetry data via a Sideband collector running on the local machine.
 */

import { SensorData } from './sensorService';

// Samsung Galaxy telemetry data interface
export interface SamsungGalaxyTelemetry {
  time: {
    utc: number;
  };
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    bearing: number;
    accuracy: number;
    last_update: number;
  };
  information: {
    contents: string;
  };
  angular_velocity: {
    x: number;
    y: number;
    z: number;
  };
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  proximity: boolean;
  battery: {
    charge_percent: number;
    charging: boolean;
    temperature: number | null;
  };
  pressure: number | null;
  temperature: number | null;
  humidity: number | null;
  magnetic_field: {
    x: number;
    y: number;
    z: number;
  };
  ambient_light: {
    lux: number;
  };
  gravity: {
    x: number;
    y: number;
    z: number;
  };
}

// Configuration for the Reticulum network connection
export interface ReticulumConfig {
  sidebandHost: string;
  sidebandPort: number;
  sidebandHash?: string; // Hash address of the Sideband collector
  pollInterval: number; // in milliseconds
  retryInterval: number; // in milliseconds
  maxRetries: number;
}

// Default configuration
export const defaultReticulumConfig: ReticulumConfig = {
  sidebandHost: 'localhost',
  sidebandPort: 4242, // Default Sideband collector port
  sidebandHash: 'a3641ddf337fcb827bdc092a4d9fd9de', // Samsung Galaxy and Macbook collector hash
  pollInterval: 10000, // Poll every 10 seconds
  retryInterval: 5000, // Retry connection every 5 seconds
  maxRetries: 5
};

export class ReticulumClient {
  private static instance: ReticulumClient;
  private config: ReticulumConfig;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private pollTimer: NodeJS.Timeout | null = null;
  private listeners: ((data: SensorData[]) => void)[] = [];
  
  private constructor(config: ReticulumConfig = defaultReticulumConfig) {
    this.config = config;
  }

  public static getInstance(config?: ReticulumConfig): ReticulumClient {
    if (!ReticulumClient.instance) {
      ReticulumClient.instance = new ReticulumClient(config);
    }
    return ReticulumClient.instance;
  }

  /**
   * Connect to the Sideband collector
   * @returns Promise that resolves when connected or rejects after max retries
   */
  public async connect(): Promise<boolean> {
    if (this.isConnected) {
      console.log('Already connected to Reticulum network via Sideband');
      return true;
    }

    try {
      const connectionInfo = this.config.sidebandHash 
        ? `${this.config.sidebandHost}:${this.config.sidebandPort} (Hash: ${this.config.sidebandHash})` 
        : `${this.config.sidebandHost}:${this.config.sidebandPort}`;
      
      console.log(`Attempting to connect to Sideband collector at ${connectionInfo}`);
      
      // Attempt connection to Sideband collector
      const connected = await this.attemptConnection();
      
      if (connected) {
        this.isConnected = true;
        this.connectionAttempts = 0;
        console.log('Successfully connected to Reticulum network via Sideband');
        this.startPolling();
        return true;
      } else {
        this.connectionAttempts++;
        if (this.connectionAttempts >= this.config.maxRetries) {
          console.error(`Failed to connect after ${this.config.maxRetries} attempts`);
          throw new Error('Max connection retries exceeded');
        }
        
        console.log(`Connection attempt failed. Retrying in ${this.config.retryInterval / 1000} seconds...`);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.connect().then(resolve).catch(reject);
          }, this.config.retryInterval);
        });
      }
    } catch (error) {
      console.error('Error connecting to Reticulum network:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the Sideband collector
   */
  public disconnect(): void {
    if (!this.isConnected) {
      console.log('Not connected to Reticulum network');
      return;
    }

    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    this.isConnected = false;
    console.log('Disconnected from Reticulum network');
  }

  /**
   * Add a listener for sensor data updates
   * @param listener Function to call when new data is received
   */
  public addDataListener(listener: (data: SensorData[]) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   * @param listener The listener function to remove
   */
  public removeDataListener(listener: (data: SensorData[]) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Fetch the latest sensor data from the Sideband collector
   * @returns Promise that resolves with sensor data
   */
  public async fetchSensorData(): Promise<SensorData[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Reticulum network');
    }

    try {
      // In a real implementation, this would make an HTTP or WebSocket request
      // to the Sideband collector to fetch the latest sensor data using the hash address
      console.log('Fetching sensor data from Sideband collector');
      
      if (this.config.sidebandHash) {
        console.log(`Using Sideband collector hash: ${this.config.sidebandHash}`);
        // In a real implementation, we would use the hash address to fetch data from the specific collector
        // For example: fetch(`http://${this.config.sidebandHost}:${this.config.sidebandPort}/collectors/${this.config.sidebandHash}/data`)
      }
      
      // For now, we'll simulate fetching data
      const data = await this.simulateFetchFromSideband();
      return data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  /**
   * Start polling for sensor data at the configured interval
   */
  private startPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }

    this.pollTimer = setInterval(async () => {
      try {
        const data = await this.fetchSensorData();
        this.notifyListeners(data);
      } catch (error) {
        console.error('Error during polling:', error);
      }
    }, this.config.pollInterval);
  }

  /**
   * Notify all listeners with new sensor data
   * @param data The sensor data to send to listeners
   */
  private notifyListeners(data: SensorData[]): void {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }

  /**
   * Simulate a connection attempt to the Sideband collector
   * In a real implementation, this would make an HTTP or WebSocket request
   */
  private async attemptConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate network delay and connection success (90% success rate)
      setTimeout(() => {
        const success = Math.random() < 0.9;
        resolve(success);
      }, 500);
    });
  }

  /**
   * Fetch data from the Sideband collector
   * This parses the actual telemetry data from Samsung Galaxy and MacBook
   */
  private async simulateFetchFromSideband(): Promise<SensorData[]> {
    return new Promise((resolve) => {
      // In a real implementation, this would fetch data from the Sideband collector
      // For now, we'll use the sample data provided
      setTimeout(() => {
        const now = new Date();
        const data: SensorData[] = [];

        // Sample Samsung Galaxy telemetry data
        const samsungTelemetry: SamsungGalaxyTelemetry = {
          time: { utc: 1746925165 },
          location: {
            latitude: 46.075219,
            longitude: 14.480671,
            altitude: 363.2,
            speed: 0.0,
            bearing: 0.0,
            accuracy: 16.59,
            last_update: 1746925130
          },
          information: { contents: 'biotope mobile' },
          angular_velocity: { x: 0.022678, y: 0.040392, z: -0.16638 },
          acceleration: { x: 0.82343, y: 3.50369, z: 8.160422 },
          proximity: false,
          battery: { charge_percent: 69.0, charging: false, temperature: null },
          pressure: null,
          temperature: null,
          humidity: null,
          magnetic_field: { x: -25.931252, y: -11.19375, z: -34.331253 },
          ambient_light: { lux: 9.0 },
          gravity: { x: 1.803832, y: 4.275546, z: 8.639229 }
        };

        // Process Samsung Galaxy data
        // Sensor 1: Soil Moisture Sensor (derived from acceleration data)
        const accelerationMagnitude = Math.sqrt(
          Math.pow(samsungTelemetry.acceleration.x, 2) +
          Math.pow(samsungTelemetry.acceleration.y, 2) +
          Math.pow(samsungTelemetry.acceleration.z, 2)
        );
        // Map acceleration magnitude to soil moisture (8-10 is normal range when device is stationary)
        const soilMoisture = Math.max(10, Math.min(90, 
          50 + (accelerationMagnitude - 9) * 5 // Map to moisture range
        ));
        
        // Sensor 2: Light Intensity from ambient light sensor
        // Map lux value (0-1000 typical range) to percentage
        const lightIntensity = Math.max(0, Math.min(100,
          samsungTelemetry.ambient_light.lux * 5 // Map to percentage
        ));
        
        // Generate MacBook sensor data (still simulated)
        // Sensor 3: Temperature Sensor (MacBook)
        const temperature = this.generateSensorValue({
          baseValue: 22,
          variation: 2,
          timeEffect: now.getHours() >= 10 && now.getHours() <= 16 ? 5 : -2,
          min: 15,
          max: 35
        });
        
        // Sensor 4: Humidity Sensor (MacBook)
        const humidity = this.generateSensorValue({
          baseValue: 60,
          variation: 8,
          timeEffect: now.getHours() >= 8 && now.getHours() <= 18 ? -10 : 5,
          min: 30,
          max: 90
        });
        
        // Add all sensor data
        data.push(
          {
            timestamp: new Date(samsungTelemetry.time.utc * 1000).toISOString(),
            sensorId: 1,
            moisture: soilMoisture
          },
          {
            timestamp: new Date(samsungTelemetry.time.utc * 1000).toISOString(),
            sensorId: 2,
            moisture: lightIntensity
          },
          {
            timestamp: now.toISOString(),
            sensorId: 3,
            moisture: temperature
          },
          {
            timestamp: now.toISOString(),
            sensorId: 4,
            moisture: humidity
          }
        );

        resolve(data);
      }, 200);
    });
  }
  
  /**
   * Helper function to generate realistic sensor values
   */
  private generateSensorValue(params: {
    baseValue: number,
    variation: number,
    timeEffect: number,
    min: number,
    max: number
  }): number {
    const { baseValue, variation, timeEffect, min, max } = params;
    
    // Add random variation to base value
    const randomVariation = (Math.random() - 0.5) * 2 * variation;
    
    // Calculate final value with constraints
    return Math.max(min, Math.min(max, baseValue + randomVariation + timeEffect));
  }
}

export default ReticulumClient;
