const { sendSuccess } = require('../utils/response');

const pingServer = (req, res) => {
  return sendSuccess(res, 'Integration successful! Backend is connected to Frontend.', {
    timestamp: new Date().toISOString(),
    status: 'Active'
  });
};

module.exports = {
  pingServer
};
