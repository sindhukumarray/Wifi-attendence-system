const pool = require('./src/config/db');

const checkCols = async () => {
  const res = await pool.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('departments', 'sessions', 'students')");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit();
};

checkCols();
