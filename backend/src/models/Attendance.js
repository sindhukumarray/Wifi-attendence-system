const pool = require('../config/db');

const Attendance = {
  getHistoryByStudent: async (studentId) => {
    const result = await pool.query(
      `SELECT a.*, a.attendance_time as recorded_at, s.start_time, s.end_time, s.room_no, sub.subject_name, sub.subject_code, f.name as faculty_name
       FROM attendance a
       JOIN sessions s ON a.session_id = s.id
       JOIN subjects sub ON s.subject_id = sub.id
       LEFT JOIN faculty f ON s.faculty_id = f.id
       WHERE a.student_id = $1
       ORDER BY s.start_time DESC`,
      [studentId]
    );
    return result.rows;
  },

  getStats: async (studentId) => {
    // This query calculates total sessions available for the student vs sessions they were present for.
    // In a real system, we would join with student_subject_enrollment.
    // For this prototype, we'll assume a present record means they attended.
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_classes,
        SUM(CASE WHEN status::text = 'Present' THEN 1 ELSE 0 END) as present_classes
       FROM attendance 
       WHERE student_id = $1`,
      [studentId]
    );
    return result.rows[0];
  }
};

module.exports = Attendance;
