import { useState, useCallback } from 'react';
import useAuth from './useAuth';
import facultyApi from '../api/facultyApi';
import { toast } from 'react-hot-toast';

const useFaculty = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [liveAttendance, setLiveAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [reports, setReports] = useState([]);
  const { updateUser } = useAuth();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await facultyApi.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
        setActiveSession(response.data.data.activeSession);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveSession = useCallback(async () => {
    try {
      const response = await facultyApi.getActiveSession();
      if (response.data.success) {
        setActiveSession(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch active session');
    }
  }, []);

  const fetchLiveAttendance = useCallback(async (sessionId) => {
    if (!sessionId) return;
    try {
      const response = await facultyApi.getLiveAttendance(sessionId);
      if (response.data.success) {
        setLiveAttendance(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch live attendance');
    }
  }, []);

  const startSession = async (data) => {
    setLoading(true);
    try {
      const response = await facultyApi.startSession(data);
      if (response.data.success) {
        setActiveSession(response.data.data);
        toast.success('Session started successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start session');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const endSession = async (sessionId) => {
    setLoading(true);
    try {
      const response = await facultyApi.endSession(sessionId);
      if (response.data.success) {
        setActiveSession(null);
        setLiveAttendance([]);
        toast.success('Session ended successfully!');
        return true;
      }
    } catch (error) {
      toast.error('Failed to end session');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicData = useCallback(async () => {
    try {
      const [subRes, classRes] = await Promise.all([
        facultyApi.getSubjects(),
        facultyApi.getClassrooms()
      ]);
      if (subRes.data.success) setSubjects(subRes.data.data);
      if (classRes.data.success) setClassrooms(classRes.data.data);
    } catch (error) {
      toast.error('Failed to load academic data');
    }
  }, []);

  const fetchReports = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await facultyApi.getReports(filters);
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await facultyApi.updateProfile(data);
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success('Profile updated successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    dashboardData,
    activeSession,
    liveAttendance,
    subjects,
    classrooms,
    reports,
    fetchDashboard,
    fetchActiveSession,
    fetchLiveAttendance,
    startSession,
    endSession,
    fetchAcademicData,
    fetchReports,
    updateProfile
  };
};

export default useFaculty;
