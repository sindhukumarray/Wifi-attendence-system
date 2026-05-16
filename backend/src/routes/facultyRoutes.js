const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const facultyValidation = require('../validations/facultyValidation');

// All routes are protected and restricted to faculty
router.use(protect);
router.use(authorizeRoles('faculty'));

// Dashboard & Profile
router.get('/dashboard', facultyController.getDashboard);
router.get('/profile', facultyController.getProfile);
router.put('/profile', facultyValidation.updateProfile, facultyController.updateProfile);

// Academic Data
router.get('/classrooms', facultyController.getClassrooms);
router.get('/subjects', facultyController.getSubjects);

// Session Management
router.post('/sessions/start', facultyValidation.startSession, facultyController.startSession);
router.post('/sessions/:sessionId/end', facultyController.endSession);
router.get('/sessions/active', facultyController.getActiveSession);

// Attendance Monitoring
router.get('/sessions/:sessionId/attendance', facultyController.getLiveAttendance);

// Reports
router.get('/reports', facultyValidation.reportFilters, facultyController.getReports);

module.exports = router;
