const { sendError } = require('../utils/response');

// Factory function to generate middleware for specific roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure protect middleware ran first
    if (!req.user || !req.user.role) {
      return sendError(res, 'Not authorized, role missing', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, `Role '${req.user.role}' is not authorized to access this resource`, 403);
    }

    next();
  };
};

module.exports = authorizeRoles;
