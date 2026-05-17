const main = async () => {
  const loginRes = await fetch('https://wifi-attendence-system-backend.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'faculty@example.com', password: 'password123', role: 'faculty' })
  });
  const loginData = await loginRes.json();
  console.log('Login Result:', loginData);

  if (!loginData.success) return;

  const token = loginData.data.token;

  const dashboardRes = await fetch('https://wifi-attendence-system-backend.onrender.com/api/faculty/dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dashboardData = await dashboardRes.json();
  console.log('Dashboard Data:', dashboardData);
};

main().catch(console.error);
