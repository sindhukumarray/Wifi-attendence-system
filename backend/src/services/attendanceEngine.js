const pool = require('../config/db');
const validationService = require('./validationService');
const Attendance = require('../models/Attendance');

const attendanceEngine = {
  /**
   * Processes a list of detected MAC addresses for a specific classroom
   * @param {number} classroomId 
   * @param {string[]} detectedMacs 
   * @returns {Promise<Object>} Summary of processing
   */
  processDetection: async (classroomId, detectedMacs) => {
    // 1. Validate Session
    const session = await validationService.validateActiveSession(classroomId);
    if (!session) {
      return { success: false, message: 'No active session for this classroom', count: 0 };
    }

    // 2. Validate Devices -> Get Student IDs
    const studentIds = await validationService.validateDevices(detectedMacs);
    if (studentIds.length === 0) {
      return { success: true, message: 'No registered devices detected', count: 0, sessionId: session.id };
    }

    // 3. Prevent Duplicates & Mark Attendance
    // We use a single query with ON CONFLICT to efficiently handle bulk inserts and prevent duplicates
    let markedCount = 0;
    try {
      const values = studentIds.map(id => `(${id}, ${session.id}, 'Present')`).join(',');
      const query = `
        INSERT INTO attendance (student_id, session_id, status)
        VALUES ${values}
        ON CONFLICT (student_id, session_id) DO NOTHING
        RETURNING id
      `;
      
      const result = await pool.query(query);
      markedCount = result.rowCount;

      // 4. Emit Realtime Event if new attendance was marked
      if (markedCount > 0) {
        const { getIO } = require('../sockets/socketManager');
        const io = getIO();
        
        // Fetch detailed student info for the UI
        const newRecords = await pool.query(
          `SELECT a.id, s.name as student_name, s.roll_no, a.attendance_time as recorded_at
           FROM attendance a
           JOIN students s ON a.student_id = s.id
           WHERE a.id = ANY($1)`,
          [result.rows.map(r => r.id)]
        );

        io.to(`session_${session.id}`).emit('attendance_updated', {
          sessionId: session.id,
          newStudents: newRecords.rows,
          totalCount: await this.getLiveCount(session.id)
        });
      }
    } catch (error) {
      console.error('Attendance Engine Error:', error.message);
      throw new Error('Failed to process attendance records');
    }

    return {
      success: true,
      message: `Successfully processed ${markedCount} new attendance records`,
      count: markedCount,
      sessionId: session.id,
      subject: session.subject_name
    };
  },

  getLiveCount: async (sessionId) => {
    const res = await pool.query('SELECT COUNT(*) FROM attendance WHERE session_id = $1', [sessionId]);
    return parseInt(res.rows[0].count);
  }
};

module.exports = attendanceEngine;
