const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { registerDeviceValidation, updateProfileValidation } = require('../validations/studentValidation');

// All routes here are protected and restricted to 'student' role
router.use(protect);
router.use(authorizeRoles('student'));

// Profile Routes
router.get('/profile', studentController.getProfile);
router.put('/profile', updateProfileValidation, studentController.updateProfile);

// Device Routes
router.post('/register-device', registerDeviceValidation, studentController.registerDevice);
router.get('/devices', studentController.getDevices);
router.delete('/device/:id', studentController.deleteDevice);

// Attendance Routes
router.get('/attendance', studentController.getAttendance);
router.get('/attendance-percentage', studentController.getAttendancePercentage);

// Dashboard Route (Optimized)
router.get('/dashboard', studentController.getDashboard);

module.exports = router;
