const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

let io;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
allowedOrigins.push('http://localhost:5173');

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Enterprise Middleware: JWT Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded; // Attach user info (id, email, role)
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Secure connection established: ${socket.id} (User: ${socket.user.email})`);

    // Faculty only joining for session rooms
    socket.on('join_session', (sessionId) => {
      // Security: Only allow faculty/admins to join session rooms for monitoring
      if (socket.user.role !== 'faculty' && socket.user.role !== 'admin') {
        console.warn(`🚨 Unauthorized room join attempt by ${socket.user.email}`);
        return;
      }

      const room = `session_${sessionId}`;
      socket.join(room);
      console.log(`👤 Faculty ${socket.user.email} is now monitoring room: ${room}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
