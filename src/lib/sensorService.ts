import { SensorConfig, sensorConfigs } from './sensorConfig';
import ReticulumClient, { defaultReticulumConfig } from './reticulumClient';

export interface SensorData {
  timestamp: string;
  sensorId: number;
  moisture: number;
}

export enum DataSource {
  MOCK = 'mock',
  RETICULUM = 'reticulum'
}

export class SensorService {
  private static instance: SensorService;
  private reticulumClient: ReticulumClient;
  private dataSource: DataSource = DataSource.MOCK;
  private cachedData: SensorData[] = [];
  private lastUpdated: Date | null = null;
  private isConnecting: boolean = false;
  private connectionError: string | null = null;
  
  private constructor() {
    this.reticulumClient = ReticulumClient.getInstance(defaultReticulumConfig);
    
    // Set up listener for real-time updates from Reticulum
    this.reticulumClient.addDataListener((data: SensorData[]) => {
      this.handleNewData(data);
    });
  }

  public static getInstance(): SensorService {
    if (!SensorService.instance) {
      SensorService.instance = new SensorService();
    }
    return SensorService.instance;
  }

  /**
   * Get the current data source (mock or Reticulum)
   */
  public getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * Set the data source to use (mock or Reticulum)
   */
  public async setDataSource(source: DataSource): Promise<void> {
    if (source === this.dataSource) return;
    
    this.dataSource = source;
    
    if (source === DataSource.RETICULUM) {
      await this.connectToReticulum();
    } else {
      // Disconnect from Reticulum if we're switching to mock data
      this.reticulumClient.disconnect();
    }
  }

  /**
   * Get the connection status to the Reticulum network
   */
  public getConnectionStatus(): { isConnecting: boolean; error: string | null } {
    return {
      isConnecting: this.isConnecting,
      error: this.connectionError
    };
  }

  /**
   * Connect to the Reticulum network via Sideband collector
   */
  public async connectToReticulum(): Promise<boolean> {
    if (this.isConnecting) return false;
    
    this.isConnecting = true;
    this.connectionError = null;
    
    try {
      const connected = await this.reticulumClient.connect();
      this.isConnecting = false;
      return connected;
    } catch (error) {
      this.isConnecting = false;
      this.connectionError = error instanceof Error ? error.message : 'Unknown error';
      return false;
    }
  }

  /**
   * Get sensor data - either from Reticulum or mock data depending on the current data source
   */
  async getSensorData(): Promise<SensorData[]> {
    if (this.dataSource === DataSource.RETICULUM) {
      try {
        // If we have cached data and it's recent (last 30 seconds), use that
        if (this.cachedData.length > 0 && this.lastUpdated && 
            (new Date().getTime() - this.lastUpdated.getTime() < 30000)) {
          return this.cachedData;
        }
        
        // Otherwise fetch new data from Reticulum
        return await this.reticulumClient.fetchSensorData();
      } catch (error) {
        console.error('Error fetching from Reticulum, falling back to mock data:', error);
        // Fall back to mock data if there's an error
        return this.generateMockData();
      }
    } else {
      // Use mock data
      return this.generateMockData();
    }
  }

  /**
   * Generate mock sensor data for testing
   */
  private async generateMockData(): Promise<SensorData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const data: SensorData[] = [];

        // Generate mock data for the last 24 hours
        for (let i = 0; i < 24; i++) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          
          // Generate mock data for each sensor
          for (let sensorId = 1; sensorId <= 6; sensorId++) {
            // Simulate realistic moisture levels (0-100%)
            const moisture = 50 + Math.random() * 20 * Math.sin(i / 4);
            data.push({
              timestamp: time.toISOString(),
              sensorId,
              moisture: Math.max(0, Math.min(100, moisture))
            });
          }
        }

        resolve(data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      }, 1000);
    });
  }

  /**
   * Handle new data received from the Reticulum network
   */
  private handleNewData(data: SensorData[]): void {
    this.cachedData = data;
    this.lastUpdated = new Date();
    
    // Log for debugging
    console.log(`Received ${data.length} sensor readings from Reticulum network`);
  }

  getSensorConfig(sensorId: number): SensorConfig | undefined {
    return sensorConfigs.find(sensor => sensor.id === sensorId);
  }
}
