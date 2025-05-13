const fs = require("fs-extra");
const path = require("path");
const { format } = require("date-fns");

// Configuration
const BACKUP_DIR = path.join(process.cwd(), "sensor-data-backup");
const CURRENT_YEAR = format(new Date(), "yyyy");

// Create backup directory if it doesn't exist
fs.ensureDirSync(BACKUP_DIR);

class SensorBackup {
  constructor() {
    this.data = [];
  }

  async saveReading(reading) {
    try {
      // Validate basic reading structure
      if (!reading.timestamp || !reading.sensorId || !reading.moisture) {
        return {
          success: false,
          message: "Invalid reading format"
        };
      }

      // Add to data
      this.data.push(reading);

      // Sort by timestamp
      this.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Save to file
      const backupFile = path.join(BACKUP_DIR, `sensor-data-${CURRENT_YEAR}.json`);
      await fs.writeJSON(backupFile, {
        metadata: {
          start_date: this.data[0]?.timestamp || new Date().toISOString(),
          end_date: this.data[this.data.length - 1]?.timestamp || new Date().toISOString(),
          total_readings: this.data.length
        },
        data: this.data
      }, { spaces: 2 });

      return {
        success: true,
        message: "Reading saved successfully"
      };
    } catch (error) {
      console.error("Error saving reading:", error);
      return {
        success: false,
        message: "Error saving reading"
      };
    }
  }
}

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const backup = new SensorBackup();
    const body = JSON.parse(event.body);
    const result = await backup.saveReading(body);

    return {
      statusCode: result.success ? 200 : 400,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};