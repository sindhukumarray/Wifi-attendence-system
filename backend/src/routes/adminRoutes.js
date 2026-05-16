const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// All routes here are protected and restricted to 'admin' role
router.use(protect);
router.use(authorizeRoles('admin'));

// Dashboard route
router.get('/dashboard', adminController.getDashboard);

// Students routes
router.get('/students', adminController.getStudents);

// Faculty routes
router.get('/faculty', adminController.getFaculty);

module.exports = router;
