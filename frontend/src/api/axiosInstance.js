import axios from 'axios';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 & Global Errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session Expired logic
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      
      // Force redirect if not on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please slow down.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
