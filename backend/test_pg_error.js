const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://user:pass@ep-polished-mouse-aom8wndl-pooler.c-2.ap-southeast-1.aws.neon.tech/db',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const client = await pool.connect();
}
main();
