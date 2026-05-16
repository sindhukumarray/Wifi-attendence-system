require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    const name = process.argv[2] || 'Dr. Faculty';
    const email = process.argv[3] || 'faculty@smartwifi.com';
    const password = process.argv[4] || 'faculty123';

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO faculty (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
      [name, email, hashedPassword]
    );
    
    console.log(`✅ Faculty created successfully!`);
    console.log(`   Name:     ${name}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

main();
