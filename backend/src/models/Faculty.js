const pool = require('../config/db');

const Faculty = {
  findById: async (id) => {
    const result = await pool.query(
      `SELECT f.id, f.name, f.email, f.department_id, d.department_name 
       FROM faculty f
       LEFT JOIN departments d ON f.department_id = d.id
       WHERE f.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { name, email } = data;
    const result = await pool.query(
      'UPDATE faculty SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
      [name, email, id]
    );
    return result.rows[0];
  },

  getSubjects: async (facultyId) => {
    // Join subjects with a hypothetical faculty_subjects table if many-to-many,
    // or just filter subjects if they have a faculty_id column.
    // Based on Phase 4, subjects have subject_name and subject_code.
    const result = await pool.query(
      `SELECT * FROM subjects WHERE faculty_id = $1 OR id IN (
        SELECT subject_id FROM sessions WHERE faculty_id = $1
      )`,
      [facultyId]
    );
    return result.rows;
  }
};

module.exports = Faculty;
