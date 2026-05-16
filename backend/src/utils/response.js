/**
 * Standard Success Response Format
 */
const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard Error Response Format
 */
const sendError = (res, message, errorDetails = null, statusCode = 500) => {
  const response = {
    success: false,
    message,
  };
  
  if (errorDetails) {
    response.error = errorDetails;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
