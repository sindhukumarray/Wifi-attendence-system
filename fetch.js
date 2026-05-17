const main = async () => {
  const loginRes = await fetch('https://wifi-attendence-system-backend.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'password123', role: 'admin' })
  });
  const loginData = await loginRes.json();
  console.log('Login Result:', loginData);

  if (!loginData.success) return;

  const token = loginData.data.token;

  const statsRes = await fetch('https://wifi-attendence-system-backend.onrender.com/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const statsData = await statsRes.json();
  console.log('Stats Result:', statsData);

  const analyticsRes = await fetch('https://wifi-attendence-system-backend.onrender.com/api/analytics/admin', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const analyticsData = await analyticsRes.json();
  console.log('Analytics Result:', analyticsData);
};

main().catch(console.error);
