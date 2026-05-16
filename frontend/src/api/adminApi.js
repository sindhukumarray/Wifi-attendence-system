import api from './axios';

const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: () => api.get('/admin/students'),
  getFaculty: () => api.get('/admin/faculty')
};

export default adminApi;
