const axios = require("axios");

// Test data
const testData = {
  timestamp: "2025-05-13T17:35:47+02:00",
  sensorId: 1,
  moisture: 55.2,
  location: "Garden Bed 1",
  deviceType: "Samsung Galaxy"
};

// Function to test the backup system
async function testBackup() {
  try {
    const response = await axios.post(
      "https://api.netlify.com/functions/sensor-backup",
      testData
    );
    
    console.log("Response:", response.data);
    
    if (response.data.success) {
      console.log("Test successful! Data saved.");
    } else {
      console.error("Test failed:", response.data.message);
    }
  } catch (error) {
    console.error("Error during test:", error.response?.data || error.message);
  }
}

// Run the test
testBackup();
