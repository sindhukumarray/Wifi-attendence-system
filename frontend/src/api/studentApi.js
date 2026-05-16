import api from './axios';

const studentApi = {
  // Profile
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),

  // Devices
  getDevices: () => api.get('/students/devices'),
  registerDevice: (data) => api.post('/students/register-device', data),
  deleteDevice: (id) => api.delete(`/students/device/${id}`),

  // Attendance
  getAttendance: () => api.get('/students/attendance'),
  getAttendancePercentage: () => api.get('/students/attendance-percentage'),
  markAttendance: (data) => api.post('/attendance/mark', data),

  // Combined Dashboard
  getDashboard: () => api.get('/students/dashboard')
};

export default studentApi;
