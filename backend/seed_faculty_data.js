const pool = require('./src/config/db');

const fixAndSeed = async () => {
  const client = await pool.connect();
  try {
    console.log('⏳ Fixing schema and seeding data...');

    // 1. Add faculty_id to subjects if it doesn't exist
    await client.query(`
      ALTER TABLE subjects ADD COLUMN IF NOT EXISTS faculty_id INT REFERENCES faculty(id) ON DELETE SET NULL;
    `);

    // 2. Seed departments if empty
    const deptCount = await client.query('SELECT COUNT(*) FROM departments');
    if (parseInt(deptCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO departments (department_name) VALUES ('Computer Science'), ('Electrical Engineering');
      `);
    }

    // 3. Seed classrooms if empty
    const roomCount = await client.query('SELECT COUNT(*) FROM classrooms');
    if (parseInt(roomCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO classrooms (room_name, wifi_ssid, building_name) VALUES 
        ('Lab 101', 'CSE_WIFI', 'Main Building'),
        ('Lecture Hall 1', 'CAMPUS_WIFI', 'Science Block'),
        ('Room 202', 'DEPT_WIFI', 'Main Building');
      `);
    }

    // 4. Seed subjects if empty
    const subjectCount = await client.query('SELECT COUNT(*) FROM subjects');
    if (parseInt(subjectCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO subjects (subject_name, subject_code, faculty_id) VALUES 
        ('Data Structures', 'CS101', 1),
        ('Web Development', 'CS202', 1),
        ('Database Management', 'CS303', 1);
      `);
    }

    console.log('✅ Schema fixed and data seeded!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    process.exit();
  }
};

fixAndSeed();
