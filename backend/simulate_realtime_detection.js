const pool = require('./src/config/db');

const simulate = async () => {
  let sessionId;
  try {
    console.log('🚀 Setting up Realtime Detection Simulation...');

    // 1. Create a fake active session
    console.log('1. Creating active session...');
    const sessionRes = await pool.query(`
      INSERT INTO sessions (faculty_id, subject_id, classroom_id, start_time, is_active)
      VALUES (1, 1, 1, CURRENT_TIMESTAMP, TRUE)
      RETURNING id
    `);
    sessionId = sessionRes.rows[0].id;
    console.log(`✅ Session created with ID: ${sessionId}`);

    console.log('⏳ Waiting 2 seconds for frontend browser subagent to connect...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Mark attendance for a student
    const payload = {
      classroom_id: 1,
      mac_addresses: ['CC:CC:CC:CC:CC:CC'] 
    };

    console.log('2. Triggering detection via API...');
    const response = await fetch('http://localhost:5000/api/attendance/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-scanner-key': 'wifi_attend_secret_2024'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('✅ Response from Engine:', data);

    console.log('⏳ Waiting 5 seconds before cleanup...');
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Simulation failed:', error.message);
  } finally {
    if (sessionId) {
      await pool.query('UPDATE sessions SET is_active = FALSE WHERE id = $1', [sessionId]);
      console.log('🧹 Cleanup: Session closed.');
    }
    process.exit();
  }
};

simulate();
