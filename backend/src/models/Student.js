const pool = require('../config/db');

const Student = {
  findById: async (id) => {
    const result = await pool.query(
      `SELECT s.*, d.department_name 
       FROM students s 
       LEFT JOIN departments d ON s.department_id = d.id 
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { name, email } = data;
    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    return result.rows[0];
  }
};

module.exports = Student;
