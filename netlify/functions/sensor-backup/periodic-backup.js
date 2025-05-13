const axios = require("axios");
const { SensorBackup } = require("./index");

// Configuration
const SIDE_BAND_CONFIG = {
  host: "localhost",
  port: 4242,
  hash: "a3641ddf337fcb827bdc092a4d9fd9de"
};

// Function to periodically backup data
async function periodicBackup() {
  try {
    const backup = new SensorBackup();
    
    // Fetch data from Sideband collector
    const response = await axios.get(`http://${SIDE_BAND_CONFIG.host}:${SIDE_BAND_CONFIG.port}/data`, {
      params: {
        hash: SIDE_BAND_CONFIG.hash
      }
    });
    
    // Process each reading
    for (const reading of response.data) {
      await backup.saveReading(reading);
    }
    
    console.log("Periodic backup completed successfully");
  } catch (error) {
    console.error("Error during periodic backup:", error.message);
  }
}

// Run every hour
setInterval(periodicBackup, 60 * 60 * 1000);

// Run immediately on start
periodicBackup();
