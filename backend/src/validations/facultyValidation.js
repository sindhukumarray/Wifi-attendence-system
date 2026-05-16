const { body, query } = require('express-validator');

const facultyValidation = {
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  
  startSession: [
    body('subject_id').isInt().withMessage('Valid subject ID is required'),
    body('classroom_id').isInt().withMessage('Valid classroom ID is required')
  ],
  
  updateProfile: [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email format')
  ],

  reportFilters: [
    query('startDate').optional().isDate().withMessage('Invalid start date'),
    query('endDate').optional().isDate().withMessage('Invalid end date'),
    query('subject_id').optional().isInt().withMessage('Invalid subject ID')
  ]
};

module.exports = facultyValidation;
