const pool = require('../config/db');

const Session = {
  create: async (data) => {
    const { faculty_id, subject_id, classroom_id, start_time } = data;
    const result = await pool.query(
      `INSERT INTO sessions (faculty_id, subject_id, classroom_id, start_time, is_active) 
       VALUES ($1, $2, $3, $4, TRUE) 
       RETURNING *`,
      [faculty_id, subject_id, classroom_id, start_time]
    );
    return result.rows[0];
  },

  end: async (sessionId) => {
    const result = await pool.query(
      'UPDATE sessions SET is_active = FALSE, end_time = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [sessionId]
    );
    return result.rows[0];
  },

  findActiveByFaculty: async (facultyId) => {
    const result = await pool.query(
      `SELECT s.*, sub.subject_name, sub.subject_code, c.room_name 
       FROM sessions s
       JOIN subjects sub ON s.subject_id = sub.id
       JOIN classrooms c ON s.classroom_id = c.id
       WHERE s.faculty_id = $1 AND s.is_active = TRUE`,
      [facultyId]
    );
    return result.rows[0];
  },

  findActiveByClassroom: async (classroomId) => {
    const result = await pool.query(
      'SELECT * FROM sessions WHERE classroom_id = $1 AND is_active = TRUE',
      [classroomId]
    );
    return result.rows[0];
  },

  getRecentSessions: async (facultyId, limit = 5) => {
    const result = await pool.query(
      `SELECT s.*, sub.subject_name, c.room_name
       FROM sessions s
       JOIN subjects sub ON s.subject_id = sub.id
       JOIN classrooms c ON s.classroom_id = c.id
       WHERE s.faculty_id = $1
       ORDER BY s.start_time DESC
       LIMIT $2`,
      [facultyId, limit]
    );
    return result.rows;
  }
};

module.exports = Session;
