import React, { useState, useEffect } from 'react';
import SensorService, { DataSource } from '@/lib/sensorService';
import ReticulumClient from '@/lib/reticulumClient';
import { useTranslations } from 'next-intl';
import { Box, Button, SxProps, Theme, Typography, CircularProgress, Collapse, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface ReticulumDataSourceSelectorProps {
  dataSource: DataSource;
  onDataSourceChange: (source: DataSource) => Promise<void>;
  sx?: SxProps<Theme>;
}

export const ReticulumDataSourceSelector: React.FC<ReticulumDataSourceSelectorProps> = ({ 
  dataSource, 
  onDataSourceChange,
  sx = {}
}) => {
  const t = useTranslations('sensors');
  const [currentDataSource, setCurrentDataSource] = useState<DataSource>(dataSource);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [sidebandHash, setSidebandHash] = useState<string>('a3641ddf337fcb827bdc092a4d9fd9de');
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  
  // Get singleton instances
  const sensorService = SensorService;
  const reticulumClient = ReticulumClient.getInstance();

  useEffect(() => {
    // Initialize with the current data source
    setCurrentDataSource(dataSource);
    
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
    
    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, [sensorService, dataSource]);

  const handleDataSourceChange = async (newSource: DataSource) => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      await onDataSourceChange(newSource);
      setCurrentDataSource(newSource);
    } catch (error) {
      console.error('Error changing data source:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to change data source');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleConnectReticulum = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      await handleDataSourceChange(DataSource.RETICULUM);
    } catch (error) {
      console.error('Error connecting to Reticulum:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect to Reticulum');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleUseMockData = () => {
    handleDataSourceChange(DataSource.MOCK);
  };

  return (
    <Box sx={sx}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant={currentDataSource === DataSource.RETICULUM ? 'contained' : 'outlined'}
            color="primary"
            onClick={handleConnectReticulum}
            disabled={isConnecting}
            startIcon={isConnecting ? <CircularProgress size={20} /> : null}
          >
            {t('connectToReticulum')}
          </Button>
          
          <Button
            variant={currentDataSource === DataSource.MOCK ? 'contained' : 'outlined'}
            color="secondary"
            onClick={handleUseMockData}
            disabled={isConnecting}
          >
            {t('useMockData')}
          </Button>
          
          <Button
            onClick={handleToggleDetails}
            endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="small"
          >
            {showDetails ? t('hideDetails') : t('showDetails')}
          </Button>
        </Box>
        
        <Collapse in={showDetails}>
          <Paper elevation={2} sx={{ p: 2, mt: 1, backgroundColor: 'background.paper' }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('connectionStatus')}
            </Typography>
            
            <Box>
              <Typography variant="body2">
                <strong>{t('currentSource')}:</strong> {currentDataSource}
              </Typography>
              <Typography variant="body2">
                <strong>{t('status')}:</strong> {isConnecting ? t('connecting') : t('connected')}
              </Typography>
              
              {connectionError && (
                <Typography variant="body2" color="error">
                  <strong>{t('error')}:</strong> {connectionError}
                </Typography>
              )}
              
              {currentDataSource === DataSource.RETICULUM && (
                <Typography variant="caption" display="block" sx={{ mt: 1, fontFamily: 'monospace' }}>
                  Sideband: {sidebandHash}
                </Typography>
              )}
            </Box>
          </Paper>
        </Collapse>
      </Box>
    </Box>
  );
};

export default ReticulumDataSourceSelector;
