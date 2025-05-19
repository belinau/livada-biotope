import { SensorConfig, sensorConfigs } from './sensorConfig';
import ReticulumClient, { defaultReticulumConfig } from './reticulumClient';
import { EventEmitter } from 'events';

declare const module: {
  hot?: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  };
};

export interface SensorData {
  id: string;
  value: number;
  timestamp: Date;
  type: string;
  unit: string;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  value: number;
}

type DataListener = (data: SensorData) => void;

export enum DataSource {
  MOCK = 'mock',
  RETICULUM = 'reticulum'
}

class SensorService extends EventEmitter {
  private static instance: SensorService;
  private dataListeners: Map<string, DataListener[]> = new Map();
  private historicalData: Map<string, HistoricalDataPoint[]> = new Map();
  private isConnected = false;
  private dataSource: DataSource = DataSource.MOCK;
  private cachedData: SensorData[] = [];
  private lastUpdated: Date | null = null;
  private isConnecting = false;
  private connectionError: string | null = null;
  private reticulumClient: ReticulumClient;
  private pollInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.setMaxListeners(50);
    this.reticulumClient = ReticulumClient.getInstance();
    this.initialize();
  }

  public static getInstance(): SensorService {
    if (!SensorService.instance) {
      SensorService.instance = new SensorService();
    }
    return SensorService.instance;
  }

  private async initialize() {
    try {
      await this.connect();
      this.setupPolling();
    } catch (error) {
      console.error('Failed to initialize sensor service:', error);
      this.connectionError = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  public async connect(): Promise<boolean> {
    if (this.isConnected || this.isConnecting) {
      return this.isConnected;
    }

    this.isConnecting = true;
    this.connectionError = null;

    try {
      if (this.dataSource === DataSource.RETICULUM) {
        await this.reticulumClient.connect();
      }
      this.isConnected = true;
      this.emit('connected');
      return true;
    } catch (error) {
      this.connectionError = error instanceof Error ? error.message : 'Failed to connect';
      this.emit('error', this.connectionError);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  private setupPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }

    this.pollInterval = setInterval(async () => {
      try {
        await this.fetchData();
      } catch (error) {
        console.error('Error polling sensor data:', error);
      }
    }, 5000); // Poll every 5 seconds
  }

  private async fetchData() {
    try {
      let data: SensorData[] = [];
      
      if (this.dataSource === DataSource.RETICULUM) {
        data = await this.reticulumClient.getSensorData();
      } else {
        // Mock data fallback
        data = sensorConfigs.map(config => ({
          id: config.id,
          value: Math.random() * (config.max - config.min) + config.min,
          timestamp: new Date(),
          type: config.type,
          unit: config.unit,
        }));
      }

      this.cachedData = data;
      this.lastUpdated = new Date();
      this.notifyListeners(data);
      this.storeHistoricalData(data);
      this.emit('data', data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      this.emit('error', error instanceof Error ? error.message : 'Failed to fetch data');
    }
  }

  private notifyListeners(data: SensorData[]) {
    data.forEach(sensorData => {
      const listeners = this.dataListeners.get(sensorData.id) || [];
      listeners.forEach(listener => listener(sensorData));
    });
  }

  private storeHistoricalData(data: SensorData[]) {
    const now = new Date();
    data.forEach(sensorData => {
      const history = this.historicalData.get(sensorData.id) || [];
      history.push({
        timestamp: now,
        value: sensorData.value
      });
      
      // Keep only the last 1000 data points
      if (history.length > 1000) {
        history.shift();
      }
      
      this.historicalData.set(sensorData.id, history);
    });
  }

  public getSensorData(sensorId?: string): SensorData[] {
    if (sensorId) {
      return this.cachedData.filter(data => data.id === sensorId);
    }
    return [...this.cachedData];
  }

  public getHistoricalData(sensorId: string, limit = 100): HistoricalDataPoint[] {
    const history = this.historicalData.get(sensorId) || [];
    return history.slice(-limit);
  }

  public subscribe(sensorId: string, callback: DataListener): () => void {
    if (!this.dataListeners.has(sensorId)) {
      this.dataListeners.set(sensorId, []);
    }
    
    const listeners = this.dataListeners.get(sensorId)!;
    listeners.push(callback);
    
    // Immediately send current data if available
    const currentData = this.getSensorData(sensorId);
    if (currentData.length > 0) {
      callback(currentData[0]);
    }
    
    // Return unsubscribe function
    return () => {
      const listeners = this.dataListeners.get(sensorId) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  public setDataSource(source: DataSource) {
    if (this.dataSource !== source) {
      this.dataSource = source;
      this.initialize();
    }
  }

  public getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      error: this.connectionError,
      lastUpdated: this.lastUpdated,
      dataSource: this.dataSource,
    };
  }

  public cleanup() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    
    if (this.dataSource === DataSource.RETICULUM) {
      this.reticulumClient.disconnect();
    }
    
    this.isConnected = false;
    this.emit('disconnected');
  }
}

const sensorService = SensorService.getInstance();

export default sensorService;

// Clean up on hot module replacement
if (typeof module !== 'undefined' && module.hot) {
  module.hot.dispose(() => {
    sensorService.cleanup();
  });
}
