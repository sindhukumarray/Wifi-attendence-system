import { useState, useCallback } from 'react';
import adminApi from '../api/adminApi';
import { toast } from 'react-hot-toast';

const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [classrooms, setClassrooms] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load system stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await adminApi.getAllStudents(params);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFaculty = useCallback(async (params) => {
    try {
      setLoading(true);
      const response = await adminApi.getAllFaculty(params);
      if (response.data.success) {
        setFaculty(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load faculty');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClassrooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllClassrooms();
      if (response.data.success) {
        setClassrooms(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecord = async (type, data) => {
    try {
      setLoading(true);
      let res;
      if (type === 'student') res = await adminApi.createStudent(data);
      else if (type === 'faculty') res = await adminApi.createFaculty(data);
      else if (type === 'classroom') res = await adminApi.createClassroom(data);
      
      if (res.data.success) {
        toast.success(`${type} created successfully`);
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to create ${type}`);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const deleteRecord = async (type, id) => {
    try {
      setLoading(true);
      let res;
      if (type === 'student') res = await adminApi.deleteStudent(id);
      else if (type === 'faculty') res = await adminApi.deleteFaculty(id);
      else if (type === 'classroom') res = await adminApi.deleteClassroom(id);

      if (res.data.success) {
        toast.success(`${type} deleted successfully`);
        return true;
      }
    } catch (err) {
      toast.error(`Failed to delete ${type}`);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    loading,
    error,
    dashboardData,
    students,
    faculty,
    classrooms,
    fetchDashboard,
    fetchStudents,
    fetchFaculty,
    fetchClassrooms,
    createRecord,
    deleteRecord
  };
};

export default useAdmin;
