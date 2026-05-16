const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');

const helmet = require('helmet');
const xss = require('xss-clean');

const { globalLimiter } = require('./security/securityConfig');

const app = express();

// Security Middleware
app.use(helmet());
app.use(xss());

app.use('/api', globalLimiter);

// Middlewares
app.use(loggerMiddleware);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Smart Wi-Fi Attendance API is running...' });
});

// Routes
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
