import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { format } from 'date-fns';

// Configuration
const BACKUP_DIR = path.join(process.cwd(), 'sensor-data-backup');
const CURRENT_YEAR = format(new Date(), 'yyyy');

// Ensure backup directory exists
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating backup directory:', error);
    throw new Error('Failed to initialize backup directory');
  }
}

// Interface for sensor reading
interface SensorReading {
  timestamp: string;
  sensorId: string;
  moisture: number;
  temperature?: number;
  humidity?: number;
  [key: string]: any; // Allow additional properties
}

// Main handler
async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }
  
  if (request.method === 'POST') {
    return handlePost(request);
  }
  
  return new NextResponse('Method not allowed', { status: 405 });
}

// Handle POST requests
async function handlePost(request: Request) {
  try {
    await ensureBackupDir();
    
    const body: SensorReading = await request.json();
    
    // Validate required fields
    if (!body.timestamp || !body.sensorId || body.moisture === undefined) {
      return NextResponse.json(
        { success: false, message: 'Invalid reading format' },
        { status: 400 }
      );
    }
    
    // Create backup file path
    const backupFile = path.join(BACKUP_DIR, `sensor-data-${CURRENT_YEAR}.json`);
    
    // Read existing data or initialize new
    let existingData = { metadata: { start_date: '', end_date: '', total_readings: 0 }, data: [] as SensorReading[] };
    
    try {
      const fileContent = await fs.readFile(backupFile, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, use default
      existingData.metadata.start_date = new Date().toISOString();
    }
    
    // Add new reading
    existingData.data.push(body);
    existingData.metadata.end_date = new Date().toISOString();
    existingData.metadata.total_readings = existingData.data.length;
    
    // Save back to file
    await fs.writeFile(backupFile, JSON.stringify(existingData, null, 2));
    
    const response = NextResponse.json({ success: true });
    addCorsHeaders(response);
    return response;
    
  } catch (error) {
    console.error('Error processing sensor data:', error);
    const response = NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
    addCorsHeaders(response);
    return response;
  }
}

// Handle OPTIONS for CORS preflight
function handleOptions() {
  const response = new NextResponse(null, { status: 204 });
  addCorsHeaders(response);
  return response;
}

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
}

export { handler as POST, handler as OPTIONS };
