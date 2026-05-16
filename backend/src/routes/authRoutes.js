const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerRules, loginRules } = require('../validations/authValidation');
const validateRequest = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post(
  '/register',
  registerRules,
  validateRequest,
  authController.registerController
);

router.post(
  '/login',
  loginRules,
  validateRequest,
  authController.loginController
);

// Protected Routes
// All routes below this use 'protect' middleware
router.use(protect);

router.get('/profile', authController.profileController);

module.exports = router;
