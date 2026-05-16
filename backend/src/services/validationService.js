const pool = require('../config/db');

class ValidationException extends Error {
  constructor(errorKey, message, statusCode = 400) {
    super(message);
    this.name = 'ValidationException';
    this.errorKey = errorKey;
    this.statusCode = statusCode;
  }
}

const validationService = {
  verifyStudentDevice: async (studentId, macAddress) => {
    // Normalizing MAC Address to uppercase for strict matching
    const normalizedMac = macAddress.toUpperCase().trim();
    
    // Covering index lookup
    const { rows } = await pool.query(
      `SELECT 1 FROM devices WHERE student_id = $1 AND mac_address = $2 LIMIT 1`,
      [studentId, normalizedMac]
    );

    if (rows.length === 0) {
      throw new ValidationException(
        'DEVICE_UNAUTHORIZED', 
        'This device is not registered to your account.', 
        403
      );
    }
    return true;
  },

  verifyActiveSession: async (sessionId) => {
    const { rows } = await pool.query(
      `SELECT id, start_time, end_time, classroom_id 
       FROM sessions 
       WHERE id = $1 AND is_active = TRUE`,
      [sessionId]
    );

    if (rows.length === 0) {
      throw new ValidationException(
        'SESSION_NOT_FOUND', 
        'No active lecture found for this session.', 
        404
      );
    }

    const session = rows[0];
    const now = new Date();
    
    // Strict temporal boundary checking
    if (now < new Date(session.start_time)) {
      throw new ValidationException(
        'SESSION_NOT_STARTED', 
        'This lecture has not started yet.', 
        400
      );
    }

    if (session.end_time && now > new Date(session.end_time)) {
      throw new ValidationException(
        'SESSION_EXPIRED', 
        'This lecture has already ended.', 
        400
      );
    }

    return session;
  },

  verifyClassroomNetwork: async (classroomId, providedSsid) => {
    const { rows } = await pool.query(
      `SELECT wifi_ssid FROM classrooms WHERE id = $1`,
      [classroomId]
    );

    if (rows.length === 0) {
      throw new ValidationException(
        'CLASSROOM_NOT_FOUND', 
        'Invalid classroom configuration.', 
        404
      );
    }

    const expectedSsid = rows[0].wifi_ssid;

    if (providedSsid !== expectedSsid) {
      throw new ValidationException(
        'NETWORK_MISMATCH', 
        'You must be connected to the classroom Wi-Fi.', 
        400
      );
    }

    return true;
  },

  checkDuplicate: async (studentId, sessionId) => {
    const { rows } = await pool.query(
      `SELECT 1 FROM attendance WHERE student_id = $1 AND session_id = $2 LIMIT 1`,
      [studentId, sessionId]
    );

    if (rows.length > 0) {
      throw new ValidationException(
        'ALREADY_MARKED', 
        'Your attendance is already recorded.', 
        409
      );
    }
    
    return true;
  }
};

module.exports = { validationService, ValidationException };
