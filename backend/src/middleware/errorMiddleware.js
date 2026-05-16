const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  sendError(res, message, process.env.NODE_ENV === 'development' ? err.stack : null, statusCode);
};

module.exports = {
  errorHandler,
};
