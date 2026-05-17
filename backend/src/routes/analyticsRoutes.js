const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Student Analytics
router.get(
  '/student', 
  protect, 
  authorizeRoles('student'), 
  analyticsController.getStudentDashboard
);

router.get(
  '/student/export', 
  protect, 
  authorizeRoles('student'), 
  analyticsController.exportAttendanceReport
);

// Faculty Analytics
router.get(
  '/faculty', 
  protect, 
  authorizeRoles('faculty', 'admin'), 
  analyticsController.getFacultyDashboard
);

// Admin Analytics
router.get(
  '/admin', 
  protect, 
  authorizeRoles('admin'), 
  analyticsController.getAdminDashboard
);

module.exports = router;
