const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/log-fuel', (req, res) => {
    const data = req.body;
    // Format: Date,Odometer,Trip,FuelType,Gallons,Cost,MPG,Notes
    const logLine = `\n${data.date},${data.odometer},${data.trip},${data.fuelType},${data.gallons},${data.cost},${data.mpg},${data.notes}`;

    fs.appendFile('../data/raw_logs.csv', logLine, (err) => {
        if (err) return res.status(500).send("Error saving data");
        res.send("Data logged successfully!");
    });
});

app.listen(PORT, () => console.log(`Tiguan Trakker API running on port ${PORT}`));