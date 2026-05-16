const pool = require('../config/db');
const Session = require('../models/Session');
const Device = require('../models/Device');

const validationService = {
  /**
   * Validates a list of MAC addresses and returns associated student IDs
   * @param {string[]} macAddresses 
   * @returns {Promise<number[]>} Array of student IDs
   */
  validateDevices: async (macAddresses) => {
    if (!macAddresses || macAddresses.length === 0) return [];
    
    const result = await pool.query(
      `SELECT DISTINCT student_id 
       FROM devices 
       WHERE mac_address = ANY($1)`,
      [macAddresses]
    );
    
    return result.rows.map(row => row.student_id);
  },

  /**
   * Validates if there is an active session for the classroom
   * @param {number} classroomId 
   * @returns {Promise<Object|null>} Session object or null
   */
  validateActiveSession: async (classroomId) => {
    return await Session.findActiveByClassroom(classroomId);
  }
};

module.exports = validationService;
