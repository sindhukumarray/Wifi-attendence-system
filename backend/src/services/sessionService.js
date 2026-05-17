const pool = require('../config/db');

const sessionService = {
  /**
   * Look up the currently active session for a given classroom
   * @param {number} classroomId 
   * @returns {Object|null}
   */
  getActiveSessionByClassroom: async (classroomId) => {
    const { rows } = await pool.query(
      `SELECT id, faculty_id, subject_id, classroom_id, start_time, end_time 
       FROM sessions 
       WHERE classroom_id = $1 AND is_active = TRUE 
       LIMIT 1`,
      [classroomId]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Starts a new session for a faculty
   * @param {number} facultyId 
   * @param {number} classroomId 
   * @param {number} subjectId 
   * @param {number} durationMinutes 
   */
  startSession: async (facultyId, classroomId, subjectId, durationMinutes = 60) => {
    let client;
    try {
      client = await pool.connect();
      await client.query('BEGIN');

      // End any previously active sessions for this faculty or classroom
      await client.query(
        `UPDATE sessions SET is_active = FALSE WHERE (faculty_id = $1 OR classroom_id = $2) AND is_active = TRUE`,
        [facultyId, classroomId]
      );

      const endTime = new Date(Date.now() + durationMinutes * 60000);
      
      const { rows } = await client.query(
        `INSERT INTO sessions (faculty_id, subject_id, classroom_id, start_time, end_time, is_active)
         VALUES ($1, $2, $3, NOW(), $4, TRUE)
         RETURNING *`,
        [facultyId, subjectId, classroomId, endTime]
      );

      await client.query('COMMIT');
      return rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      if (client) client.release();
    }
  },

  /**
   * Ends a specific session
   * @param {number} sessionId 
   * @param {number} facultyId 
   */
  endSession: async (sessionId, facultyId) => {
    const { rows } = await pool.query(
      `UPDATE sessions 
       SET is_active = FALSE, end_time = NOW() 
       WHERE id = $1 AND faculty_id = $2
       RETURNING *`,
      [sessionId, facultyId]
    );
    return rows[0];
  }
};

module.exports = sessionService;
