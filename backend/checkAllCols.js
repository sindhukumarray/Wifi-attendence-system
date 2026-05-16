const pool = require('./src/config/db');

const checkAllCols = async () => {
  const res = await pool.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit();
};

checkAllCols();
