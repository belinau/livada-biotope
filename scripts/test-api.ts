import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoint(method: string, endpoint: string, params: Record<string, any> = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`\nTesting ${method} ${url}`);
    
    const response = await axios({
      method,
      url,
      params: method === 'GET' ? params : undefined,
      data: method !== 'GET' ? params : undefined,
      validateStatus: () => true // Don't throw on HTTP error status
    });
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response;
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

async function runTests() {
  console.log('Starting API tests...');
  
  // Test 1: Calendar endpoint
  console.log('\n--- Testing Calendar Endpoint ---');
  await testEndpoint('GET', '/calendar', { locale: 'en' });
  await testEndpoint('OPTIONS', '/calendar');
  
  // Test 2: Sideband endpoint
  console.log('\n--- Testing Sideband Endpoint ---');
  await testEndpoint('GET', '/sideband/status');
  await testEndpoint('OPTIONS', '/sideband');
  
  // Test 3: Translations endpoint
  console.log('\n--- Testing Translations Endpoint ---');
  await testEndpoint('GET', '/translations', { locale: 'en' });
  await testEndpoint('OPTIONS', '/translations');
  
  // Test 4: Sensor backup endpoint
  console.log('\n--- Testing Sensor Backup Endpoint ---');
  await testEndpoint('OPTIONS', '/sensor-backup');
  await testEndpoint('POST', '/sensor-backup', {
    timestamp: new Date().toISOString(),
    sensorId: 'test-sensor-1',
    moisture: 45.6,
    temperature: 22.4,
    humidity: 65.2
  });
  
  console.log('\nAll tests completed!');
}

// Run the tests
runTests().catch(console.error);
