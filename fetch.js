fetch('https://wifi-attendence-system-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'faculty@example.com', password: 'password123', role: 'faculty' })
}).then(res => res.json()).then(console.log).catch(console.error);
