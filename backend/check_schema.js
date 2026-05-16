const pool = require('./src/config/db');

const checkSchema = async () => {
  const client = await pool.connect();
  try {
    const tables = ['subjects', 'sessions', 'classrooms', 'faculty', 'students', 'attendance', 'departments'];
    for (const table of tables) {
      console.log(`--- Table: ${table} ---`);
      try {
        const res = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
        `, [table]);
        console.table(res.rows);
      } catch (e) {
        console.log(`Error checking table ${table}: ${e.message}`);
      }
    }
  } finally {
    client.release();
    process.exit();
  }
};

checkSchema();
