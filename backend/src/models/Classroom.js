const pool = require('../config/db');

const Classroom = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM classrooms ORDER BY room_name ASC');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM classrooms WHERE id = $1', [id]);
    return result.rows[0];
  }
};

module.exports = Classroom;
