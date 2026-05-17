import api from './axios';

const adminApi = {
  // Stats
  getDashboardStats: () => api.get('/admin/stats'),
  getAdminAnalytics: () => api.get('/analytics/admin'),

  // Students
  getAllStudents: (params) => api.get('/admin/students', { params }),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),

  // Faculty
  getAllFaculty: (params) => api.get('/admin/faculty', { params }),
  createFaculty: (data) => api.post('/admin/faculty', data),
  updateFaculty: (id, data) => api.put(`/admin/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/admin/faculty/${id}`),

  // Classrooms
  getAllClassrooms: () => api.get('/admin/classrooms'),
  createClassroom: (data) => api.post('/admin/classrooms', data),
  updateClassroom: (id, data) => api.put(`/admin/classrooms/${id}`, data),
  deleteClassroom: (id) => api.delete(`/admin/classrooms/${id}`),

  // Attendance Control
  getActiveSessions: () => api.get('/admin/active-sessions'),
  forceEndSession: (sessionId) => api.post(`/admin/sessions/${sessionId}/end`)
};

export default adminApi;
