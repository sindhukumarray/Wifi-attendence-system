import api from './axios';

const facultyApi = {
  getDashboard: () => api.get('/faculty/dashboard'),
  getProfile: () => api.get('/faculty/profile'),
  updateProfile: (data) => api.put('/faculty/profile', data),
  getClassrooms: () => api.get('/faculty/classrooms'),
  getSubjects: () => api.get('/faculty/subjects'),
  startSession: (data) => api.post('/faculty/sessions/start', data),
  endSession: (sessionId) => api.post(`/faculty/sessions/${sessionId}/end`),
  getActiveSession: () => api.get('/faculty/sessions/active'),
  getLiveAttendance: (sessionId) => api.get(`/faculty/sessions/${sessionId}/attendance`),
  getReports: (params) => api.get('/faculty/reports', { params })
};

export default facultyApi;
