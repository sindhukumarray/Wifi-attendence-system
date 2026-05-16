const Session = require('../models/Session');
const Faculty = require('../models/Faculty');
const Classroom = require('../models/Classroom');
const pool = require('../config/db');

const facultyService = {
  getDashboardData: async (facultyId) => {
    const profile = await Faculty.findById(facultyId);
    const activeSession = await Session.findActiveByFaculty(facultyId);
    const recentSessions = await Session.getRecentSessions(facultyId);
    
    // Calculate total sessions and total students reached
    const statsResult = await pool.query(
      `SELECT COUNT(DISTINCT s.id) as total_sessions, COUNT(a.id) as total_attendance
       FROM sessions s
       LEFT JOIN attendance a ON s.id = a.session_id
       WHERE s.faculty_id = $1`,
      [facultyId]
    );

    return {
      profile,
      activeSession: activeSession || null,
      recentSessions,
      stats: {
        total_sessions: parseInt(statsResult.rows[0].total_sessions || 0),
        total_attendance: parseInt(statsResult.rows[0].total_attendance || 0)
      }
    };
  },

  startNewSession: async (facultyId, data) => {
    // 1. Check if faculty already has an active session
    const existingSession = await Session.findActiveByFaculty(facultyId);
    if (existingSession) {
      throw new Error('You already have an active session. Please end it first.');
    }

    // 2. Check if classroom is occupied
    const roomOccupied = await Session.findActiveByClassroom(data.classroom_id);
    if (roomOccupied) {
      throw new Error('This classroom already has an active session.');
    }

    // 3. Create session
    return await Session.create({
      faculty_id: facultyId,
      subject_id: data.subject_id,
      classroom_id: data.classroom_id,
      start_time: new Date()
    });
  },

  getLiveAttendance: async (sessionId) => {
    const result = await pool.query(
      `SELECT a.*, s.name as student_name, s.roll_no, d.mac_address, a.attendance_time as recorded_at
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       LEFT JOIN devices d ON s.id = d.student_id
       WHERE a.session_id = $1
       ORDER BY a.attendance_time DESC`,
      [sessionId]
    );
    return result.rows;
  },

  generateReport: async (facultyId, filters) => {
    const { startDate, endDate, subject_id } = filters;
    let query = `
      SELECT a.*, s.name as student_name, s.roll_no, sub.subject_name, sub.subject_code, sess.start_time, a.attendance_time as recorded_at
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN sessions sess ON a.session_id = sess.id
      JOIN subjects sub ON sess.subject_id = sub.id
      WHERE sess.faculty_id = $1
    `;
    const params = [facultyId];

    if (startDate) {
      params.push(startDate);
      query += ` AND sess.start_time >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND sess.start_time <= $${params.length}`;
    }
    if (subject_id) {
      params.push(subject_id);
      query += ` AND sess.subject_id = $${params.length}`;
    }

    query += ' ORDER BY sess.start_time DESC, a.attendance_time DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }
};

module.exports = facultyService;
