/*
Project: Tiguan Trakker API Ingestion Gateway
Version: 1.0.0
Changes: Initialized native localized Express webhook endpoint for automated mobile data capture.
    Auth: Integrated via standard VS Code Port Tunnel / Microsoft Relay Environment variables.
        Description: 
    Exposes a secure digital loading dock(/api/log - fuel) on the K10 server. 
    Intercepts structured JSON payloads dispatched directly from an iPhone 
    iOS Shortcut, appends raw logs sequentially to 'raw_logs.csv', and automatically 
    spins up the 'clean_logs_v3.py' processing pipeline for automated database triage.
*/

const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());

// Main Endpoint for your iPhone Shortcut
app.post('/api/log-fuel', (req, res) => {
    const { date, odometer, trip, gallons, cost, notes } = req.body;

    // 1. Basic validation check
    if (!odometer || !gallons || !cost) {
        return res.status(400).json({ error: 'Missing mandatory tracking parameters.' });
    }

    // 2. Structure raw log row entry
    const timestamp = date || new Date().toISOString().split('T')[0];
    const rawLine = `${timestamp},${odometer},${trip || ''},Regular,${gallons},${cost},,${notes || 'Mobile Input'}\n`;

    const rawLogPath = path.join(__dirname, 'data', 'raw_logs.csv');

    // 3. Append to your K10 raw data pool
    fs.appendFile(rawLogPath, rawLine, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database write collision failed.' });
        }

        // 4. Trigger clean_logs.py pipeline instantly 
        exec('python3 clean_logs.py', (pyErr, stdout, stderr) => {
            if (pyErr) {
                console.error(`Execution error: ${pyErr}`);
                return res.status(200).json({
                    status: 'Saved Raw',
                    message: 'Logged locally, but Gemini triage engine pipeline failed.'
                });
            }

            return res.status(200).json({
                status: 'Success',
                message: 'Data successfully triaged and committed to master database logs!'
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`K10 Webhook Engine Listening on Port ${PORT}`));