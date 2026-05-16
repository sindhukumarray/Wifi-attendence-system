const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const adminController = {
  getDashboard: async (req, res) => {
    try {
      const studentsResult = await pool.query('SELECT COUNT(*) as total FROM students');
      const totalStudents = parseInt(studentsResult.rows[0].total) || 0;

      const facultyResult = await pool.query('SELECT COUNT(*) as total FROM faculty');
      const totalFaculty = parseInt(facultyResult.rows[0].total) || 0;

      const activeSessionsResult = await pool.query("SELECT COUNT(*) as total FROM sessions WHERE status = 'active'");
      const activeSessions = parseInt(activeSessionsResult.rows[0].total) || 0;

      const presentTodayResult = await pool.query(`
        SELECT COUNT(DISTINCT a.student_id) as present_today
        FROM attendance a
        JOIN sessions s ON a.session_id = s.id
        WHERE DATE(s.start_time) = CURRENT_DATE AND a.status = 'Present'
      `);
      const presentToday = parseInt(presentTodayResult.rows[0].present_today) || 0;

      const recentActivityResult = await pool.query(`
        SELECT a.id, a.status, a.attendance_time as time, s.name as student_name
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        ORDER BY a.attendance_time DESC
        LIMIT 10
      `);

      res.json({
        success: true,
        data: {
          total_students: totalStudents,
          total_faculty: totalFaculty,
          active_sessions: activeSessions,
          system_health: '99.9%',
          stats: {
            totalStudents,
            totalFaculty,
            presentToday,
            activeSessions
          },
          recentActivity: recentActivityResult.rows
        }
      });
    } catch (error) {
      console.error('Admin Dashboard Error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getStudents: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT s.id, s.name, s.email, s.roll_no, s.created_at
        FROM students s
        ORDER BY s.created_at DESC
      `);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createStudent: async (req, res) => {
    try {
      const { name, email, password, roll_no } = req.body;
      if (!name || !email || !password || !roll_no) {
        return res.status(400).json({ success: false, message: 'All fields are required (name, email, password, roll_no)' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO students (name, email, password, roll_no) VALUES ($1, $2, $3, $4) RETURNING id, name, email, roll_no',
        [name, email, hashedPassword, roll_no]
      );
      res.status(201).json({ success: true, data: result.rows[0], message: 'Student created successfully' });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'A user with this email or roll number already exists' });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM students WHERE id = $1', [id]);
      res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getFaculty: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT f.id, f.name, f.email, f.created_at,
               (SELECT COUNT(*) FROM sessions WHERE faculty_id = f.id) as sessions_count
        FROM faculty f
        ORDER BY f.created_at DESC
      `);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createFaculty: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required (name, email, password)' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO faculty (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
      );
      res.status(201).json({ success: true, data: result.rows[0], message: 'Faculty created successfully' });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'A faculty member with this email already exists' });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteFaculty: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM faculty WHERE id = $1', [id]);
      res.json({ success: true, message: 'Faculty deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = adminController;
