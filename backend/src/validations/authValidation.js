const { body } = require('express-validator');

const registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['student', 'faculty', 'admin']).withMessage('Invalid role specified'),
  
  // Conditional validation based on role
  body('roll_no').if(body('role').equals('student')).notEmpty().withMessage('Roll number is required for students'),
];

const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['student', 'faculty', 'admin']).withMessage('Role is required for login to query correct table'),
];

module.exports = {
  registerRules,
  loginRules
};
