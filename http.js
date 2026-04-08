const http = require('http');

// '0.0.0.0' allows any device on your Wi-Fi to see this server
const hostname = '192.168.50.207'; 
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>K10 Backend Lab Success!</h1><p>Node.js is officially serving content from your Mini PC to your laptop.</p>');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});