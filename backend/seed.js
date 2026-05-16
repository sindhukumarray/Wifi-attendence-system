const authService = require('./src/services/authService');
const pool = require('./src/config/db');

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding default users...');

    // Try to register Admin
    try {
      await authService.register({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✅ Created Admin (admin@example.com / password123)');
    } catch (e) {
      console.log('⚠️ Admin already exists or error:', e.message);
    }

    // Try to register Student
    try {
      await authService.register({
        name: 'Demo Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
        roll_no: 'DEMO123'
      });
      console.log('✅ Created Student (student@example.com / password123)');
    } catch (e) {
      console.log('⚠️ Student already exists or error:', e.message);
    }

    // Try to register Faculty
    try {
      await authService.register({
        name: 'Demo Faculty',
        email: 'faculty@example.com',
        password: 'password123',
        role: 'faculty'
      });
      console.log('✅ Created Faculty (faculty@example.com / password123)');
    } catch (e) {
      console.log('⚠️ Faculty already exists or error:', e.message);
    }

    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit();
  }
};

seedUsers();
