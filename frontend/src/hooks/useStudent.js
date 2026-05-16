import { useState, useEffect, useCallback } from 'react';
import studentApi from '../api/studentApi';
import { toast } from 'react-hot-toast';

const useStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [devices, setDevices] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch dashboard data';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAttendance();
      if (response.data.success) {
        setAttendance(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDevices();
      if (response.data.success) {
        setDevices(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to load registered devices');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerDevice = async (data) => {
    try {
      const response = await studentApi.registerDevice(data);
      if (response.data.success) {
        toast.success('Device registered successfully');
        fetchDevices(); // Refresh list
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const deleteDevice = async (id) => {
    try {
      const response = await studentApi.deleteDevice(id);
      if (response.data.success) {
        toast.success('Device removed');
        fetchDevices(); // Refresh list
        return true;
      }
    } catch (err) {
      toast.error('Failed to remove device');
      return false;
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await studentApi.updateProfile(data);
      if (response.data.success) {
        toast.success('Profile updated');
        return true;
      }
    } catch (err) {
      toast.error('Failed to update profile');
      return false;
    }
  };

  return {
    loading,
    error,
    dashboardData,
    attendance,
    devices,
    fetchDashboard,
    fetchAttendance,
    fetchDevices,
    registerDevice,
    deleteDevice,
    updateProfile
  };
};

export default useStudent;
