const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract the first error message
    const errorMessage = errors.array()[0].msg;
    return sendError(res, errorMessage, 400);
  }
  next();
};

module.exports = validateRequest;
