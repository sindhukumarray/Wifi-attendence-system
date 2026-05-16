const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { register, login } = require('../validations/authValidation');
const validate = require('../middleware/validatorMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post(
  '/register',
  register,
  validate,
  authController.registerController
);

router.post(
  '/login',
  login,
  validate,
  authController.loginController
);

// Protected Routes
// All routes below this use 'protect' middleware
router.use(protect);

router.get('/profile', authController.profileController);

module.exports = router;
