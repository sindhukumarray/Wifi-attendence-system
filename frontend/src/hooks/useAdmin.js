import { useState, useCallback } from 'react';
import adminApi from '../api/adminApi';
import { toast } from 'react-hot-toast';

const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch admin dashboard';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getStudents();
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFaculty = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getFaculty();
      if (response.data.success) {
        setFaculty(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    dashboardData,
    students,
    faculty,
    fetchDashboard,
    fetchStudents,
    fetchFaculty
  };
};

export default useAdmin;
