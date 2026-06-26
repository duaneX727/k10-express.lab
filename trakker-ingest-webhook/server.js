/*
Project: Tiguan Trakker API Ingestion Gateway
Version: 1.2.0
Changes: 
    - Added comprehensive incoming request key normalization to natively support both 
      iOS Shortcut payloads (total_miles, trip_miles, total_cost) and fallback manual curl test formats.
    - Locked down background process detachment vulnerabilities to prevent NVM/Node ghost 
      processes from silently capturing port 3000 traffic.
Auth: Integrated via standard VS Code Port Tunnel / Microsoft Relay Environment variables.
Description: 
    Exposes a secure digital loading dock (/api/log-fuel) on the K10 server. 
    Intercepts structured JSON payloads dispatched directly from an iPhone, normalizes the data 
    dictionary keys to eliminate NULL/None insertions, and forwards the arguments to the active 
    master database pipeline located at 'data/tiguan_data.db'.
*/

const express = require('express');
const path = require('path');
const fs = require('fs'); // Native file system module

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/log-fuel', (req, res) => {
  console.log("=====================================");
  console.log("📩 Raw Payload Received:", req.body);

  const dataPayload = {
    date: req.body.date || new Date().toISOString().split('T')[0],
    odometer: req.body.total_miles || req.body.odometer || "0",
    trip_distance: req.body.trip_miles || req.body.trip_distance || "0",
    gallons: req.body.gallons || "0",
    price_per_gallon: req.body.price_per_gallon || "0",
    total_cost: req.body.total_cost || req.body.cost || "0",
    notes: req.body.notes || "No notes provided"
  };

  console.log("📱 Normalized Data:", dataPayload);

  // Back up exactly ONE level to 'lab-server' before entering 'K10-Lab'
  const targetFile = path.join(__dirname, '..', 'K10-Lab', 'Tiguan-Project', 'latest_fuel_log.json');
  try {
    fs.writeFileSync(targetFile, JSON.stringify(dataPayload, null, 4), 'utf8');
    console.log(`✅ File written successfully to: ${targetFile}`);

    return res.status(200).json({
      status: "Success",
      message: "Data saved securely to file. Ready for ETL consumption.",
      filePath: targetFile
    });
  } catch (writeError) {
    console.error(`❌ File System Error: ${writeError.message}`);
    return res.status(500).json({ status: "Error", message: writeError.message });
  }
});

app.listen(port, () => {
  console.log(`📡 K10 Webhook Engine Active on Port ${port}`);
});