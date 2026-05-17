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

// Classrooms CRUD
router.get('/classrooms', adminController.getClassrooms);
router.post('/classrooms', adminController.createClassroom);
router.put('/classrooms/:id', adminController.updateClassroom);
router.delete('/classrooms/:id', adminController.deleteClassroom);

// Temporary Migration
router.get('/migrate-capacity', async (req, res) => {
  const pool = require('../config/db');
  try {
    await pool.query('ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 50');
    res.send('Migration successful: Added capacity column to classrooms');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
