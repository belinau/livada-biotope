import React, { useState, useEffect } from 'react';
import { SensorService, DataSource } from '@/lib/sensorService';
import ReticulumClient from '@/lib/reticulumClient';
import { useLanguage } from '../../contexts/LanguageContext';

export const ReticulumDataSourceSelector: React.FC = () => {
  const { t } = useLanguage();
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.MOCK);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [sidebandHash, setSidebandHash] = useState<string>('a3641ddf337fcb827bdc092a4d9fd9de');
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  const sensorService = SensorService.getInstance();

  useEffect(() => {
    // Initialize with the current data source
    setDataSource(sensorService.getDataSource());
    
    // Check connection status
    const status = sensorService.getConnectionStatus();
    setIsConnecting(status.isConnecting);
    setConnectionError(status.error);
    
    // Set up a timer to periodically check connection status
    const timer = setInterval(() => {
      const status = sensorService.getConnectionStatus();
      setIsConnecting(status.isConnecting);
      setConnectionError(status.error);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const configureSidebandHash = () => {
    if (!sidebandHash.trim()) {
      setConnectionError('Please enter a valid Sideband collector hash address');
      return;
    }
    
    // Update the ReticulumClient configuration with the hash address
    const reticulumClient = ReticulumClient.getInstance();
    reticulumClient['config'].sidebandHash = sidebandHash.trim();
    
    setIsConfigured(true);
    setConnectionError(null);
    console.log(`Configured Sideband collector hash: ${sidebandHash}`);
  };

  const handleDataSourceChange = async (source: DataSource) => {
    if (source === DataSource.RETICULUM && !isConfigured) {
      setConnectionError('Please configure the Sideband collector hash address first');
      setShowDetails(true);
      return;
    }
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      await sensorService.setDataSource(source);
      setDataSource(source);
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      // Update connection status
      const status = sensorService.getConnectionStatus();
      setIsConnecting(status.isConnecting);
      setConnectionError(status.error);
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-md font-medium text-gray-700">{t('sensors.dataSource')}</h3>
          <p className="text-sm text-gray-500">
            {dataSource === DataSource.MOCK 
              ? t('sensors.usingSimulatedData') 
              : t('sensors.connectedToReticulum')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDataSourceChange(DataSource.MOCK)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              dataSource === DataSource.MOCK
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={isConnecting || dataSource === DataSource.MOCK}
          >
            {t('sensors.simulated')}
          </button>
          
          <button
            onClick={() => handleDataSourceChange(DataSource.RETICULUM)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              dataSource === DataSource.RETICULUM
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            disabled={isConnecting || dataSource === DataSource.RETICULUM}
          >
            {isConnecting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('sensors.connecting')}
              </span>
            ) : (
              t('sensors.reticulumNetwork')
            )}
          </button>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-600"
            aria-label={t('sensors.toggleDetails')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {showDetails ? (
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t('sensors.connectionDetails')}</h4>
          
          <div className="mb-4">
            <label htmlFor="sidebandHash" className="block text-sm font-medium text-gray-700 mb-1">{t('sensors.hashAddress')}</label>
            <div className="flex">
              <input
                type="text"
                id="sidebandHash"
                value={sidebandHash}
                onChange={(e) => setSidebandHash(e.target.value)}
                placeholder={t('sensors.enterHashAddress')}
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                disabled={isConfigured && dataSource === DataSource.RETICULUM}
              />
              <button
                onClick={configureSidebandHash}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isConfigured && dataSource === DataSource.RETICULUM}
              >
                {isConfigured ? t('sensors.configured') : t('sensors.configure')}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {t('sensors.hashAddressDescription')}
            </p>
          </div>
          
          {dataSource === DataSource.RETICULUM ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Status:</span>
                {connectionError ? (
                  <span className="text-sm text-red-500">Error</span>
                ) : (
                  <span className="text-sm text-green-500">Connected</span>
                )}
              </div>
              
              {connectionError && (
                <div className="text-sm text-red-500">
                  Error: {connectionError}
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <p>Collecting data from Reticulum network via Sideband collector.</p>
                <p className="mt-1">Sensor data is being collected in real-time from the Sideband collector running on this Mac.</p>
              </div>
              
              <button
                onClick={() => handleDataSourceChange(DataSource.RETICULUM)}
                className="mt-2 px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                disabled={isConnecting || !connectionError}
              >
                Reconnect
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p>Using simulated sensor data for demonstration purposes.</p>
              <p className="mt-1">Switch to Reticulum Network to collect real sensor data from the Sideband collector.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
