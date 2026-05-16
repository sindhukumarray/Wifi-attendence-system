const pool = require('./src/config/db');

const checkEnum = async () => {
  const res = await pool.query("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE typname = 'attendance_status'");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit();
};

checkEnum();
