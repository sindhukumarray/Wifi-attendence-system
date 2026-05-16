const pool = require('../config/db');

const adminController = {
  getDashboard: async (req, res) => {
    try {
      // Get total students
      const studentsResult = await pool.query('SELECT COUNT(*) as total FROM students');
      const totalStudents = parseInt(studentsResult.rows[0].total) || 0;

      // Get present today (unique students present today)
      const presentTodayResult = await pool.query(`
        SELECT COUNT(DISTINCT a.student_id) as present_today
        FROM attendance a
        JOIN sessions s ON a.session_id = s.id
        WHERE DATE(s.start_time) = CURRENT_DATE AND a.status = 'Present'
      `);
      const presentToday = parseInt(presentTodayResult.rows[0].present_today) || 0;

      // Get overall average attendance
      const statsResult = await pool.query(`
        SELECT 
          COUNT(*) as total_attendance_records,
          SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_records
        FROM attendance
      `);
      
      const totalRecords = parseInt(statsResult.rows[0].total_attendance_records) || 0;
      const presentRecords = parseInt(statsResult.rows[0].present_records) || 0;
      const avgAttendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

      // Get recent activity (recent attendance)
      const recentActivityResult = await pool.query(`
        SELECT a.id, a.status, a.attendance_time as time, s.name as student_name, d.mac_address as mac
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        LEFT JOIN devices d ON s.id = d.student_id
        ORDER BY a.attendance_time DESC
        LIMIT 10
      `);

      res.json({
        success: true,
        data: {
          stats: {
            totalStudents,
            presentToday,
            avgAttendance,
            trendStudents: 5, // Dummy trends for now
            trendPresent: 2.1,
            trendAvg: 1.5
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
        SELECT s.id, s.name, s.email, s.roll_no, s.created_at, d.department_name
        FROM students s
        LEFT JOIN departments d ON s.department_id = d.id
        ORDER BY s.created_at DESC
      `);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getFaculty: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT f.id, f.name, f.email, f.created_at, d.department_name,
               (SELECT COUNT(*) FROM sessions WHERE faculty_id = f.id) as sessions_count
        FROM faculty f
        LEFT JOIN departments d ON f.department_id = d.id
        ORDER BY f.created_at DESC
      `);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = adminController;
