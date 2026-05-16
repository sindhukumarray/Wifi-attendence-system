const pool = require('./src/config/db');

const initPhase4Db = async () => {
  const client = await pool.connect();
  try {
    console.log('⏳ Initializing Phase 4 Database Schema...');

    // 1. Subjects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(20) UNIQUE NOT NULL,
        department_id INT REFERENCES departments(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Sessions Table (A specific class instance)
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
        faculty_id INT REFERENCES faculty(id) ON DELETE SET NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        room_no VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Devices Table (MAC Bindings)
    await client.query(`
      CREATE TABLE IF NOT EXISTS devices (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id) ON DELETE CASCADE,
        mac_address VARCHAR(17) NOT NULL,
        device_name VARCHAR(50),
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, mac_address)
      );
    `);

    // 4. Attendance Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id) ON DELETE CASCADE,
        session_id INT REFERENCES sessions(id) ON DELETE CASCADE,
        status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late')) DEFAULT 'present',
        mac_used VARCHAR(17),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, session_id)
      );
    `);

    // 5. Query Optimization Indexes
    console.log('🚀 Creating Indexes...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_student_roll ON students(roll_no);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_device_student ON devices(student_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_session_time ON sessions(start_time);`);

    console.log('✅ Phase 4 Database Schema Initialized Successfully!');
  } catch (error) {
    console.error('❌ Database Initialization Error:', error.message);
  } finally {
    client.release();
    process.exit();
  }
};

initPhase4Db();
