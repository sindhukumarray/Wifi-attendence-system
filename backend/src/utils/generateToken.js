const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, env.JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

module.exports = generateToken;
