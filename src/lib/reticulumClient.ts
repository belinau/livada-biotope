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

// Helper to determine if we're in production
const isProduction = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'livada.bio' || 
           window.location.hostname === 'www.livada.bio';
  }
  return process.env.NODE_ENV === 'production';
};

// Default configuration with environment variables
export const defaultReticulumConfig: ReticulumConfig = {
  // In production, use api as host to trigger Netlify functions
  // In development, use localhost or the specified host
  sidebandHost: isProduction() 
    ? ''  // Use relative path for production
    : (process.env.NEXT_PUBLIC_SIDEBAND_HOST || 
      (typeof window !== 'undefined' ? window.location.hostname : 'localhost')),
  
  // Use 443 in production, or the specified port (or 3000 in development)
  sidebandPort: isProduction() 
    ? 443 
    : (parseInt(process.env.NEXT_PUBLIC_SIDEBAND_PORT || '3000')),
  
  // Use the provided hash or fallback to the default
  sidebandHash: process.env.NEXT_PUBLIC_SIDEBAND_HASH || 'a3641ddf337fcb827bdc092a4d9fd9de',
  
  pollInterval: 30000, // Poll every 30 seconds (reduced from 10s to reduce load)
  retryInterval: 10000, // Retry connection every 10 seconds (increased from 5s)
  maxRetries: 3 // Reduced max retries to fail faster
};

export class ReticulumClient {
  private static instance: ReticulumClient;
  private config: ReticulumConfig;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private pollTimer: NodeJS.Timeout | null = null;
  private listeners: ((data: SensorData[]) => void)[] = [];
  private lastErrorMessage: string | null = null;
  private baseUrl: string;
  
  private constructor(config: ReticulumConfig = defaultReticulumConfig) {
    this.config = config;
    
    // In production, use empty base URL for relative paths
    // In development, use full URL with protocol
    if (isProduction()) {
      this.baseUrl = '';
      console.log(`Initializing ReticulumClient in production mode with serverless functions`);
    } else {
      const protocol = window?.location.protocol === 'https:' ? 'https' : 'http';
      this.baseUrl = `${protocol}://${this.config.sidebandHost}:${this.config.sidebandPort}`;
      console.log(`Initializing ReticulumClient in development mode with baseUrl: ${this.baseUrl}`);
    }
  }

  public static getInstance(config?: ReticulumConfig): ReticulumClient {
    if (!ReticulumClient.instance) {
      ReticulumClient.instance = new ReticulumClient(config);
    }
    return ReticulumClient.instance;
  }

  /**
   * Get the last error message
   */
  public getLastError(): string | null {
    return this.lastErrorMessage;
  }

  /**
   * Check if client is connected
   */
  public getConnectionStatus(): { connected: boolean; error: string | null } {
    return {
      connected: this.isConnected,
      error: this.lastErrorMessage
    };
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
        this.lastErrorMessage = null;
        console.log('Successfully connected to Reticulum network via Sideband');
        this.startPolling();
        return true;
      } else {
        this.connectionAttempts++;
        if (this.connectionAttempts >= this.config.maxRetries) {
          const errorMsg = `Failed to connect after ${this.config.maxRetries} attempts`;
          this.lastErrorMessage = errorMsg;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        const retryMsg = `Connection attempt failed. Retrying in ${this.config.retryInterval / 1000} seconds...`;
        console.log(retryMsg);
        
        // Implement exponential backoff
        const backoffTime = this.config.retryInterval * Math.pow(1.5, this.connectionAttempts - 1);
        
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.connect().then(resolve).catch(reject);
          }, backoffTime);
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? 
        (error.message.includes('fetch') || error.message.includes('network')) ? 'Connection error' : error.message : 
        'Unknown error connecting to Reticulum network';
      
      this.lastErrorMessage = errorMsg;
      console.error(errorMsg);
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
      await this.connect();
    }

    try {
      console.log('Fetching sensor data from Sideband collector');
      
      // Construct the appropriate endpoint URL for the Sideband collector
      let url;
      
      if (isProduction()) {
        // In production, use the Netlify function endpoint
        url = `/.netlify/functions/sideband-bridge/data`;
        console.log('Using production endpoint for sensor data');
      } else if (this.config.sidebandHash) {
        // For development with hash, use the collectors endpoint
        url = `${this.baseUrl}/collectors/${this.config.sidebandHash}/data`;
        console.log('Using development endpoint with hash for sensor data');
      } else {
        // Fallback to generic development endpoint
        url = `${this.baseUrl}/api/sideband/data`;
        console.log('Using generic development endpoint for sensor data');
      }
      
      console.log(`Fetching data from: ${url}`);
      
      // Set a timeout for the fetch operation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData = await response.json();
      
      // Process the raw data into the SensorData format
      return this.transformSensorData(rawData);
    } catch (error) {
      const errorMsg = error instanceof Error ? 
        (error.name === 'AbortError' ? 'Request timeout' : error.message) : 
        'Unknown error fetching sensor data';
      
      this.lastErrorMessage = errorMsg;
      console.error('Error fetching sensor data:', errorMsg);
      
      // If there was a connection error, mark as disconnected
      if (error instanceof Error && 
         (error.message.includes('fetch') || error.message.includes('network'))) {
        this.isConnected = false;
      }
      
      throw error;
    }
  }

  /**
   * Transform raw data from Sideband into SensorData format
   */
  private transformSensorData(rawData: any): SensorData[] {
    try {
      // This transformation will depend on the exact format that Sideband provides
      // Using SamsungGalaxyTelemetry as an example
      
      if (Array.isArray(rawData)) {
        // Handle array of readings
        return rawData.map(item => this.parseReadingToSensorData(item));
      } else if (rawData && typeof rawData === 'object') {
        // Handle single reading
        return [this.parseReadingToSensorData(rawData)];
      }
      
      throw new Error('Unexpected data format from Sideband');
    } catch (error) {
      console.error('Error transforming sensor data:', error);
      throw new Error('Failed to transform sensor data');
    }
  }

  /**
   * Parse a single reading from Sideband format to SensorData format
   */
  private parseReadingToSensorData(reading: any): SensorData {
    // Adapt this based on the actual format from Sideband
    // This example assumes SamsungGalaxyTelemetry format
    
    if ('time' in reading && 'information' in reading) {
      // Assume it's in SamsungGalaxyTelemetry format
      const telemetry = reading as SamsungGalaxyTelemetry;
      
      // Extract moisture from information.contents
      // Format might be different in actual implementation
      const moisture = this.extractMoistureFromContents(telemetry.information.contents);
      
      return {
        timestamp: new Date(telemetry.time.utc * 1000).toISOString(),
        sensorId: 1, // Default to sensorId 1 if not specified
        moisture: moisture
      };
    } else if ('timestamp' in reading && 'moisture' in reading) {
      // Already in correct format
      return reading as SensorData;
    }
    
    // Default fallback if format doesn't match expected
    return {
      timestamp: new Date().toISOString(),
      sensorId: 1,
      moisture: 50 // Default value
    };
  }

  /**
   * Extract moisture value from information contents
   * This is a placeholder - adapt based on actual data format
   */
  private extractMoistureFromContents(contents: string): number {
    try {
      // Example: contents might be JSON string with moisture value
      const data = JSON.parse(contents);
      if (data && typeof data.moisture === 'number') {
        return data.moisture;
      }
      
      // Alternative: contents might contain moisture value directly
      const match = contents.match(/moisture[:\s]+([0-9.]+)/i);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
      
      return 50; // Default value
    } catch (e) {
      console.warn('Could not parse moisture from contents:', contents);
      return 50; // Default value
    }
  }

  /**
   * Start polling for sensor data
   */
  private startPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
    
    this.pollTimer = setInterval(async () => {
      try {
        const data = await this.fetchSensorData();
        
        // Notify all listeners
        for (const listener of this.listeners) {
          listener(data);
        }
      } catch (error) {
        console.error('Error during polling:', error);
      }
    }, this.config.pollInterval);
  }

  /**
   * Attempt connection to the Sideband collector
   * @returns Promise that resolves with success or failure
   */
  private async attemptConnection(): Promise<boolean> {
    try {
      // Try to make a simple request to check if Sideband is available
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      // Determine the appropriate status endpoint
      let url;
      if (isProduction()) {
        url = `/.netlify/functions/sideband-bridge/status`;
        console.log('Using production status endpoint');
      } else if (this.config.sidebandHash) {
        // For development with hash, use the collectors endpoint
        url = `${this.baseUrl}/collectors/${this.config.sidebandHash}/status`;
        console.log('Using development endpoint with hash for status');
      } else {
        // Fallback to generic development endpoint
        url = `${this.baseUrl}/api/sideband/status`;
        console.log('Using generic development endpoint for status');
      }
      
      console.log(`Attempting connection to Sideband at: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        // Parse response to get more detailed status
        try {
          const data = await response.json();
          console.log('Connection test successful, status:', data);
          return true;
        } catch (e) {
          console.warn('Could not parse connection response:', e);
          return response.ok; // Still return success based on HTTP status
        }
      } else {
        console.error(`Connection test failed with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('Connection attempt failed:', error);
      return false;
    }
  }
}

export default ReticulumClient;