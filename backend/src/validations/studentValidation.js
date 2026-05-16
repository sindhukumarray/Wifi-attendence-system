const { body } = require('express-validator');

const registerDeviceValidation = [
  body('mac_address')
    .notEmpty().withMessage('MAC address is required')
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).withMessage('Invalid MAC address format (XX:XX:XX:XX:XX:XX)'),
  body('device_name')
    .optional()
    .isString().withMessage('Device name must be a string')
    .isLength({ max: 50 }).withMessage('Device name must be under 50 characters')
];

const updateProfileValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
];

module.exports = {
  registerDeviceValidation,
  updateProfileValidation
};
