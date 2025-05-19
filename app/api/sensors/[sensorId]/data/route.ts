import { NextResponse } from 'next/server';
import ReticulumClient from '@/lib/reticulumClient';

export async function GET(
  request: Request,
  { params }: { params: { sensorId: string } }
) {
  try {
    const reticulumClient = ReticulumClient.getInstance();
    const sensorId = params.sensorId;
    
    // Check connection status instead of accessing private field
    const { isConnected } = reticulumClient.connectionStatus;
    
    // Connect to Reticulum if not already connected
    if (!isConnected) {
      const connected = await reticulumClient.connect();
      if (!connected) {
        return NextResponse.json(
          { error: 'Failed to connect to Reticulum network' },
          { status: 503 }
        );
      }
    }
    
    // Use fetchSensorData instead of getSensorData
    const sensorData = await reticulumClient.fetchSensorData();
    
    if (!sensorData) {
      return NextResponse.json(
        { error: 'Sensor data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(sensorData);
    
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
