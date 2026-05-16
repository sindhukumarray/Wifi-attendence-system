const pool = require('../config/db');
const { validationService, ValidationException } = require('./validationService');
const wifiScannerService = require('./wifiScannerService');

const attendanceService = {
  /**
   * Core engine for marking attendance. 
   * Validates device, session, classroom network, and checks for duplicates before insertion.
   * @param {number} studentId 
   * @param {Object} rawRequest 
   */
  markAttendance: async (studentId, rawRequest) => {
    try {
      // 1. Extract and sanitize network data
      const networkData = wifiScannerService.extractNetworkData(rawRequest);
      const { session_id, classroom_id } = rawRequest.body;

      if (!session_id || !classroom_id) {
        throw new ValidationException('MISSING_DATA', 'Session ID and Classroom ID are required', 400);
      }

      // 2. Execute Validation Pipeline (Fast-Fail)
      
      // Step A: Validate Active Session
      const session = await validationService.verifyActiveSession(session_id);

      // Verify the session actually belongs to the claimed classroom
      if (session.classroom_id !== parseInt(classroom_id, 10)) {
        throw new ValidationException('SESSION_MISMATCH', 'The active session does not match this classroom.', 400);
      }

      // Step B: Validate Device Binding
      await validationService.verifyStudentDevice(studentId, networkData.macAddress);

      // Step C: Validate Physical Classroom Network
      await validationService.verifyClassroomNetwork(classroom_id, networkData.currentSsid);

      // Optional: Verify physical BSSID if the classroom enforce it
      // await wifiScannerService.validateBSSID(networkData.bssid, classroom.expected_bssid);

      // Step D: Validate Duplicate Attendance
      await validationService.checkDuplicate(studentId, session_id);

      // 3. All validations passed -> Database Insertion
      const { rows } = await pool.query(
        `INSERT INTO attendance (student_id, session_id, status, attendance_time)
         VALUES ($1, $2, 'Present', NOW())
         RETURNING id, status, attendance_time as recorded_at`,
        [studentId, session_id]
      );

      return {
        success: true,
        message: 'Attendance successfully marked.',
        data: rows[0]
      };
      
    } catch (error) {
      if (error instanceof ValidationException) {
        return {
          success: false,
          error: error.errorKey,
          message: error.message,
          statusCode: error.statusCode
        };
      }
      
      // Log unexpected errors
      console.error('[Attendance Engine Error]:', error);
      throw error;
    }
  },

  /**
   * Get attendance for a specific session (Faculty View)
   * @param {number} sessionId 
   */
  getSessionAttendance: async (sessionId) => {
    const { rows } = await pool.query(
      `SELECT a.id, s.name as student_name, s.roll_no, a.status, a.attendance_time
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       WHERE a.session_id = $1
       ORDER BY a.attendance_time DESC`,
      [sessionId]
    );
    return rows;
  },

  /**
   * Get attendance history for a specific student
   * @param {number} studentId 
   */
  getStudentAttendance: async (studentId) => {
    const { rows } = await pool.query(
      `SELECT a.id, a.status, a.attendance_time, s.start_time, sub.subject_name, c.room_name, f.name as faculty_name
       FROM attendance a
       JOIN sessions s ON a.session_id = s.id
       JOIN subjects sub ON s.subject_id = sub.id
       JOIN classrooms c ON s.classroom_id = c.id
       JOIN faculty f ON s.faculty_id = f.id
       WHERE a.student_id = $1
       ORDER BY a.attendance_time DESC`,
      [studentId]
    );
    return rows;
  }
};

module.exports = attendanceService;
