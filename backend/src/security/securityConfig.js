const rateLimit = require('express-rate-limit');

const securityConfig = {
  // Global API Throttling
  globalLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Stricter limiter for Authentication (Prevents Brute-force)
  authLimiter: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 requests per hour
    message: {
      success: false,
      message: 'Too many login attempts, please try again after an hour'
    }
  }),

  // Stricter limiter for Attendance (Prevents Proxy Pings)
  attendanceLimiter: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, 
    message: {
      success: false,
      message: 'Too many attendance attempts detected'
    }
  })
};

module.exports = securityConfig;
