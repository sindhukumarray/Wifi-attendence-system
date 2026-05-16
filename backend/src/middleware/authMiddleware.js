const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { sendError } = require('../utils/response');

const protect = (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token provided', 401);
  }

  try {
    // Verify token signature
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Attach decoded user info (id, email, role) to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return sendError(res, 'Not authorized, token failed or expired', 401);
  }
};

module.exports = { protect };
