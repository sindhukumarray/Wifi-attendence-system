const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.connect()
  .then((client) => {
    console.log('✅ NeonDB (PostgreSQL) Connected Successfully');
    client.release();
  })
  .catch((err) => {
    console.error('❌ NeonDB Connection Error:', err.message);
  });

module.exports = pool;
