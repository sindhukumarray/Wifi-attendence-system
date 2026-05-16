const pool = require('../config/db');

const getUserByEmailAndRole = async (email, role) => {
  // Validate role to prevent SQL injection via table name
  const allowedRoles = ['students', 'faculty', 'admins'];
  const tableName = role === 'admin' ? 'admins' : role === 'faculty' ? 'faculty' : 'students';
  
  if (!allowedRoles.includes(tableName)) throw new Error('Invalid role');

  const query = `SELECT * FROM ${tableName} WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

const getStudentByRollNo = async (roll_no) => {
  const query = `SELECT * FROM students WHERE roll_no = $1`;
  const { rows } = await pool.query(query, [roll_no]);
  return rows[0];
};

const createUser = async (userData) => {
  const { name, email, password, role, roll_no } = userData;
  
  if (role === 'student') {
    const query = `
      INSERT INTO students (name, email, password, roll_no)
      VALUES ($1, $2, $3, $4) RETURNING id, name, email, roll_no, created_at
    `;
    const { rows } = await pool.query(query, [name, email, password, roll_no]);
    return rows[0];
  } else if (role === 'faculty') {
    const query = `
      INSERT INTO faculty (name, email, password)
      VALUES ($1, $2, $3) RETURNING id, name, email, created_at
    `;
    const { rows } = await pool.query(query, [name, email, password]);
    return rows[0];
  } else if (role === 'admin') {
    const query = `
      INSERT INTO admins (name, email, password)
      VALUES ($1, $2, $3) RETURNING id, name, email, created_at
    `;
    const { rows } = await pool.query(query, [name, email, password]);
    return rows[0];
  }
  
  throw new Error('Invalid role');
};

module.exports = {
  getUserByEmailAndRole,
  getStudentByRollNo,
  createUser
};
