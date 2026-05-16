const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// All routes here are protected and restricted to 'admin' role
router.use(protect);
router.use(authorizeRoles('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);
router.get('/stats', adminController.getDashboard);

// Students CRUD
router.get('/students', adminController.getStudents);
router.post('/students', adminController.createStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Faculty CRUD
router.get('/faculty', adminController.getFaculty);
router.post('/faculty', adminController.createFaculty);
router.delete('/faculty/:id', adminController.deleteFaculty);

module.exports = router;
