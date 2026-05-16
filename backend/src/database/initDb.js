const pool = require('../config/db');

const createTables = async () => {
  const client = await pool.connect();
  try {
    console.log('⏳ Starting Database Initialization...');
    
    await client.query('BEGIN');

    // Create ENUM for attendance status if not exists
    await client.query(`
      DO $$ BEGIN
          CREATE TYPE attendance_status AS ENUM ('Present', 'Absent');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `);

    // 1. Departments
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
          id SERIAL PRIMARY KEY,
          department_name VARCHAR(100) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Students
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          roll_no VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          department_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
      );
    `);

    // 3. Faculty
    await client.query(`
      CREATE TABLE IF NOT EXISTS faculty (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          department_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
      );
    `);

    // 4. Admins
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Devices
    await client.query(`
      CREATE TABLE IF NOT EXISTS devices (
          id SERIAL PRIMARY KEY,
          student_id INT NOT NULL,
          mac_address VARCHAR(100) UNIQUE NOT NULL,
          device_name VARCHAR(100),
          registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
      );
    `);

    // 6. Classrooms
    await client.query(`
      CREATE TABLE IF NOT EXISTS classrooms (
          id SERIAL PRIMARY KEY,
          room_name VARCHAR(100) NOT NULL,
          wifi_ssid VARCHAR(100) NOT NULL,
          building_name VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Subjects
    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
          id SERIAL PRIMARY KEY,
          subject_name VARCHAR(100) NOT NULL,
          subject_code VARCHAR(50) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Sessions
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          faculty_id INT NOT NULL,
          subject_id INT NOT NULL,
          classroom_id INT NOT NULL,
          start_time TIMESTAMP NOT NULL,
          end_time TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(faculty_id) REFERENCES faculty(id),
          FOREIGN KEY(subject_id) REFERENCES subjects(id),
          FOREIGN KEY(classroom_id) REFERENCES classrooms(id)
      );
    `);

    // 9. Attendance
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          student_id INT NOT NULL,
          session_id INT NOT NULL,
          status attendance_status DEFAULT 'Present',
          attendance_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
          FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE,
          UNIQUE(student_id, session_id)
      );
    `);

    // Indexes (Phase 6 Optimized)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_student_email ON students(email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_device_mac ON devices(mac_address);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_device_lookup ON devices(student_id, mac_address);`);
    
    // Partial index for ultra-fast active session lookup by classroom
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(classroom_id) WHERE is_active = true;`);
    
    // O(1) duplicate lookup index
    await client.query(`CREATE INDEX IF NOT EXISTS idx_attendance_student_session ON attendance(student_id, session_id);`);

    await client.query('COMMIT');
    console.log('✅ All tables and indexes successfully created in NeonDB!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', err.message);
  } finally {
    client.release();
    process.exit();
  }
};

createTables();
