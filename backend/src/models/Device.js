const pool = require('../config/db');

const Device = {
  create: async (studentId, macAddress, deviceName) => {
    const result = await pool.query(
      'INSERT INTO devices (student_id, mac_address, device_name) VALUES ($1, $2, $3) RETURNING *, registered_at as created_at',
      [studentId, macAddress, deviceName]
    );
    return result.rows[0];
  },

  findByStudentId: async (studentId) => {
    const result = await pool.query(
      'SELECT *, registered_at as created_at FROM devices WHERE student_id = $1 ORDER BY registered_at DESC',
      [studentId]
    );
    return result.rows;
  },

  findByMac: async (macAddress) => {
    const result = await pool.query(
      'SELECT * FROM devices WHERE mac_address = $1',
      [macAddress]
    );
    return result.rows[0];
  },

  delete: async (id, studentId) => {
    const result = await pool.query(
      'DELETE FROM devices WHERE id = $1 AND student_id = $2 RETURNING *',
      [id, studentId]
    );
    return result.rows[0];
  }
};

module.exports = Device;
