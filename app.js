const express = require('express')
const app = express()
const port = 3001


app.get('/api/status', (req, res) => {
  res.json({
    serverName: "NucBox-K10",
    status: "Online",
    uptime: "24/7",
    message: `Data successfully sent from K10 to Laptop -- Hola!, Marlon`
  });
});

app.get('/', (req,res) =>{
     console.log('<h1>Welcome to my Express Server</h1>')
});
app.get('/about', (req, res) => {
  res.send('<h1>About Me</h1><p>I am a Backend Developer in the making.</p>');
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Express app listening at http://192.168.50.207:${port}`)
});