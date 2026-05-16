const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// 1. Mark Attendance (Student Only)
router.post(
  '/mark',
  protect,
  authorizeRoles('student'),
  attendanceController.markAttendance
);

// 2. View Student's own attendance history (Student Only)
router.get(
  '/student',
  protect,
  authorizeRoles('student'),
  attendanceController.getStudentAttendance
);

// 3. View Session Attendance (Faculty / Admin)
router.get(
  '/session/:id',
  protect,
  authorizeRoles('faculty', 'admin'),
  attendanceController.getSessionAttendance
);

module.exports = router;
