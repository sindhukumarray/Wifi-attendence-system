const pool = require('../config/db');

const analyticsService = {
  /**
   * Get comprehensive stats for a student
   */
  getStudentStats: async (studentId) => {
    // 1. Calculate overall percentage
    const statsQuery = `
      SELECT 
        COUNT(*) as total_classes,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_classes
      FROM attendance
      WHERE student_id = $1
    `;
    
    // 2. Calculate subject-wise breakdown
    const subjectQuery = `
      SELECT 
        s.subject_name as name,
        COUNT(a.id) as total,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as value
      FROM subjects s
      LEFT JOIN sessions sess ON sess.subject_id = s.id
      LEFT JOIN attendance a ON a.session_id = sess.id AND a.student_id = $1
      GROUP BY s.subject_name
    `;

    // 3. Calculate Monthly Trends
    const trendQuery = `
      SELECT 
        TO_CHAR(attendance_time, 'Mon') as name,
        (COUNT(CASE WHEN status = 'Present' THEN 1 END) * 100 / NULLIF(COUNT(*), 0)) as value
      FROM attendance
      WHERE student_id = $1
      GROUP BY TO_CHAR(attendance_time, 'Mon'), DATE_TRUNC('month', attendance_time)
      ORDER BY DATE_TRUNC('month', attendance_time) ASC
      LIMIT 6
    `;

    const [stats, subjects, trends] = await Promise.all([
      pool.query(statsQuery, [studentId]),
      pool.query(subjectQuery, [studentId]),
      pool.query(trendQuery, [studentId])
    ]);

    const total = parseInt(stats.rows[0].total_classes || 0);
    const present = parseInt(stats.rows[0].present_classes || 0);
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      overview: {
        total_classes: total,
        present_classes: present,
        percentage: percentage,
        is_eligible: percentage >= 75
      },
      subjects: subjects.rows.map(r => ({
        name: r.name,
        value: r.total > 0 ? Math.round((r.value / r.total) * 100) : 0
      })),
      trends: trends.rows
    };
  },

  /**
   * Get comprehensive stats for a faculty member
   */
  getFacultyStats: async (facultyId) => {
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT s.id) as total_sessions,
        COUNT(a.id) as total_attendance_marked
      FROM sessions s
      LEFT JOIN attendance a ON a.session_id = s.id
      WHERE s.faculty_id = $1
    `;

    const classroomQuery = `
      SELECT 
        c.room_name as name,
        AVG(sub.attendance_count) as value
      FROM classrooms c
      JOIN sessions s ON s.classroom_id = c.id
      JOIN (
        SELECT session_id, COUNT(*) as attendance_count 
        FROM attendance GROUP BY session_id
      ) sub ON sub.session_id = s.id
      WHERE s.faculty_id = $1
      GROUP BY c.room_name
    `;

    const [stats, classrooms] = await Promise.all([
      pool.query(statsQuery, [facultyId]),
      pool.query(classroomQuery, [facultyId])
    ]);

    return {
      overview: {
        total_sessions: parseInt(stats.rows[0].total_sessions || 0),
        total_attendance: parseInt(stats.rows[0].total_attendance_marked || 0),
        avg_per_session: Math.round(stats.rows[0].total_attendance_marked / (stats.rows[0].total_sessions || 1))
      },
      classroom_utilization: classrooms.rows
    };
  }
};

module.exports = analyticsService;
