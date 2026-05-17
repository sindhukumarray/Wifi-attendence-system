const pool = require('./src/config/db');

const migrate = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('⏳ Running Database Migration for Phase 4...');
    
    // 1. Add is_approved column to students if it doesn't exist
    await client.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
    `);
    console.log('✅ Added is_approved column to students table');

    // 2. Auto-approve existing seeded students so they aren't locked out
    await client.query(`
      UPDATE students 
      SET is_approved = TRUE 
      WHERE is_approved = FALSE;
    `);
    console.log('✅ Auto-approved existing test students');

  } catch (err) {
    console.error('❌ Migration Error:', err.message);
  } finally {
    if (client) client.release();
    process.exit();
  }
};

migrate();
