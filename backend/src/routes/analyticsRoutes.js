const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Student Analytics
router.get(
  '/student', 
  protect, 
  restrictTo('student'), 
  analyticsController.getStudentDashboard
);

router.get(
  '/student/export', 
  protect, 
  restrictTo('student'), 
  analyticsController.exportAttendanceReport
);

// Faculty Analytics
router.get(
  '/faculty', 
  protect, 
  restrictTo('faculty', 'admin'), 
  analyticsController.getFacultyDashboard
);

module.exports = router;
