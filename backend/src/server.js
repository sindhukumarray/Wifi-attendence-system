const http = require('http');
const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');

// Database connection test can be done implicitly by db.js
// Set up server
const server = http.createServer(app);
const { initSocket } = require('./sockets/socketManager');

// Initialize Socket.io
initSocket(server);

const PORT = env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
});
