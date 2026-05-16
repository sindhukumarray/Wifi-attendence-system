require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    const pass = await bcrypt.hash('admin123', 10);
    await pool.query('INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING', ['Admin User', 'admin@smartwifi.com', pass]);
    console.log('Admin user created: admin@smartwifi.com / admin123');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
main();
