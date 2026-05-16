const testAuth = async () => {
  const baseURL = 'http://localhost:5000/api/auth';
  
  try {
    console.log('1. Testing Registration...');
    const regRes = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `test${Date.now()}@student.com`,
        password: 'password123',
        role: 'student',
        roll_no: `ROLL${Date.now()}`
      })
    });
    const regData = await regRes.json();
    console.log('Registration Success:', regData);

    console.log('\n2. Testing Login...');
    const loginRes = await fetch(`${baseURL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.data.user.email,
        password: 'password123',
        role: 'student'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Success! Token received:', loginData.data.token.substring(0, 20) + '...');

    console.log('\n3. Testing Protected Route...');
    const profileRes = await fetch(`${baseURL}/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${loginData.data.token}` }
    });
    const profileData = await profileRes.json();
    console.log('Profile Access Success:', profileData.data.user);

  } catch (error) {
    console.error('Test Failed:', error.message);
  }
};

testAuth();
