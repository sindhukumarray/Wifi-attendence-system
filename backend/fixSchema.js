const pool = require('./src/config/db');

const fixSchema = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('⏳ Fixing Database Schema...');

    // 1. Ensure Departments table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(20) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ensure students has department_id
    await client.query(`
      ALTER TABLE students ADD COLUMN IF NOT EXISTS department_id INT REFERENCES departments(id);
    `);

    // 3. Ensure sessions has room_no
    await client.query(`
      ALTER TABLE sessions ADD COLUMN IF NOT EXISTS room_no VARCHAR(20);
    `);

    // 4. Ensure faculty table exists (needed for sessions join)
    await client.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        department_id INT REFERENCES departments(id),
        role VARCHAR(20) DEFAULT 'faculty',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed a department if none exists
    const deptCheck = await client.query('SELECT COUNT(*) FROM departments');
    if (parseInt(deptCheck.rows[0].count) === 0) {
      console.log('🌱 Seeding default department...');
      await client.query("INSERT INTO departments (name, code) VALUES ('Computer Science', 'CS')");
    }

    console.log('✅ Schema Fix Applied Successfully!');
  } catch (error) {
    console.error('❌ Schema Fix Error:', error.message);
  } finally {
    if (client) client.release();
    process.exit();
  }
};

fixSchema();
