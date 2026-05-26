const express = require('express');
const app = express();
const port = 3001;

// 🔴 CRITICAL MIDDLEWARE: This parses incoming JSON request bodies
app.use(express.json());

// --- GET ROUTES ---
app.get('/api/status', (req, res) => {
  res.json({
    serverName: "NucBox-K10",
    status: "Online",
    uptime: "24/7",
    message: "Data successfully sent from K10 to Laptop -- Hola!, Marlon"
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to my Express Server</h1>');
});

app.get('/about', (req, res) => {
  res.send('<h1>About Me</h1><p>I am a Backend Developer in the making.</p>');
});

// --- NEW POST ROUTES ---

// 1. Generic System Log Receiver
app.post('/api/logs', (req, res) => {
  const incomingData = req.body;

  console.log('📥 Received system log payload:', incomingData);

  // Basic validation
  if (!incomingData.source || !incomingData.message) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: 'source' and 'message'"
    });
  }

  // Respond back to the client confirming receipt
  res.status(201).json({
    success: true,
    message: "Log successfully received on K10 hardware",
    receivedAt: new Date().toISOString()
  });
});

// 2. Vehicle Telemetry Ingestion Endpoint
app.post('/api/telemetry/vehicle', (req, res) => {
  const vehicleData = req.body;

  console.log('🚗 Ingesting vehicle data:', vehicleData);

  // Validate incoming structure
  if (!vehicleData.date || !vehicleData.miles || !vehicleData.gallons) {
    return res.status(400).json({
      success: false,
      error: "Incomplete log entry. Require date, miles, and gallons."
    });
  }

  // Optional: Calculate MPG right on the backend server
  const mpg = (vehicleData.miles / vehicleData.gallons).toFixed(2);

  res.status(201).json({
    success: true,
    message: "Vehicle log entry preserved on backend server",
    processedMetrics: {
      calculatedMpg: parseFloat(mpg),
      isPartialFill: vehicleData.partial || false
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Express app listening at http://192.168.50.207:${port}`);
});