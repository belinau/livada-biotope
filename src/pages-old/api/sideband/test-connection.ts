import { NextApiRequest, NextApiResponse } from 'next';

// Define the response type
type TestConnectionResponse = {
  success: boolean;
  message: string;
  details?: {
    host: string;
    port: number;
    hash?: string;
  };
};

/**
 * API endpoint to test connection to Sideband collector
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestConnectionResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Get configuration from environment variables or use defaults
    const sidebandHost = process.env.NEXT_PUBLIC_SIDEBAND_HOST || 'localhost';
    const sidebandPort = parseInt(process.env.NEXT_PUBLIC_SIDEBAND_PORT || '4242');
    const sidebandHash = process.env.NEXT_PUBLIC_SIDEBAND_HASH || 'a3641ddf337fcb827bdc092a4d9fd9de';
    
    // Construct API URL for the Sideband collector
    const url = `http://${sidebandHost}:${sidebandPort}/api/status`;
    
    // Set timeout for request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Check if the connection was successful
      if (response.ok) {
        return res.status(200).json({
          success: true,
          message: 'Successfully connected to Sideband collector',
          details: {
            host: sidebandHost,
            port: sidebandPort,
            hash: sidebandHash
          }
        });
      } else {
        return res.status(200).json({
          success: false,
          message: `Connection failed with status ${response.status}: ${response.statusText}`,
          details: {
            host: sidebandHost,
            port: sidebandPort,
            hash: sidebandHash
          }
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle network errors
      const errorMessage = error instanceof Error
        ? (error.name === 'AbortError' 
            ? 'Connection timed out'
            : error.message)
        : 'Unknown error';
        
      return res.status(200).json({
        success: false,
        message: `Failed to connect to Sideband collector: ${errorMessage}`,
        details: {
          host: sidebandHost,
          port: sidebandPort,
          hash: sidebandHash
        }
      });
    }
  } catch (error) {
    // Handle any other unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Server error when testing Sideband connection'
    });
  }
}