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

  const markAttendance = async (data) => {
    setLoading(true);
    try {
      const response = await studentApi.markAttendance(data);
      if (response.data.success) {
        toast.success(response.data.message || 'Attendance marked successfully!');
        fetchDashboard(); // Refresh stats
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to mark attendance';
      if (err.response?.status !== 409) { // Don't toast if already marked (idempotency)
        toast.error(msg);
      }
      return { success: false, message: msg, alreadyMarked: err.response?.status === 409 };
    } finally {
      setLoading(false);
    }
  };

  const autoMarkAttendance = useCallback(async (devices) => {
    if (!devices || devices.length === 0) return;
    
    // In Zero-Touch mode, we use the primary device
    // and try to detect the network. For web demo, we'll 
    // simulate detection.
    const primaryDevice = devices[0];
    
    // Check if we have a "simulated" SSID in session storage 
    // (set by faculty during demo for testing)
    const simulatedSsid = sessionStorage.getItem('detected_ssid');
    if (!simulatedSsid) return;

    return await markAttendance({
      mac_address: primaryDevice.mac_address,
      current_ssid: simulatedSsid
    });
  }, []);

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
    updateProfile,
    markAttendance,
    autoMarkAttendance
  };
};

export default useStudent;
