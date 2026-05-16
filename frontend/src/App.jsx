import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import api from './api/axios';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AttendanceHistory from './pages/student/AttendanceHistory';
import RegisteredDevices from './pages/student/RegisteredDevices';
import StudentAnalytics from './pages/student/StudentAnalytics';
import StudentProfile from './pages/student/StudentProfile';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ActiveSession from './pages/faculty/ActiveSession';
import FacultyReports from './pages/faculty/FacultyReports';
import FacultyProfile from './pages/faculty/FacultyProfile';
import DashboardLayout from './layouts/DashboardLayout';
import Sidebar from './components/dashboard/Sidebar';
import Navbar from './components/dashboard/Navbar';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './routes/ProtectedRoute';

import StudentsPage from './pages/admin/StudentsPage';
import FacultyPage from './pages/admin/FacultyPage';
import SettingsPage from './pages/admin/SettingsPage';

// Placeholder Page Component
const PlaceholderPage = ({ title }) => (
  <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
    <div className="flex flex-col items-center justify-center h-full text-center py-20 px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 font-medium">This module is under development and will be available in the upcoming phase.</p>
    </div>
  </DashboardLayout>
);

// Integration Test Component
const IntegrationTest = () => {
  const [backendStatus, setBackendStatus] = useState('Checking connection...');
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/test/ping');
        if (response.data.success) {
          setBackendStatus(response.data.message);
          setBackendData(response.data.data);
          toast.success('Successfully connected to Backend!');
        }
      } catch (error) {
        setBackendStatus('Failed to connect to backend.');
        toast.error('Backend connection failed!');
      }
    };
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border border-slate-100">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-6 tracking-tight">Smart Wi-Fi Attendance</h1>
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6">
          <h2 className="font-semibold text-lg mb-2">Integration Status:</h2>
          <p className="text-slate-700 font-medium">{backendStatus}</p>
        </div>
        {backendData && (
          <div className="bg-slate-50 text-left p-4 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2 border-b pb-2">Response Data:</h3>
            <pre className="text-sm text-slate-600 overflow-x-auto">{JSON.stringify(backendData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<IntegrationTest />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Shared Route */}
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Admin Only Routes (Role-guarded inside DashboardPage or Layout later) */}
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/faculty" element={<FacultyPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Faculty Only Routes */}
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/session" element={<ActiveSession />} />
              <Route path="/faculty/reports" element={<FacultyReports />} />
              <Route path="/faculty/profile" element={<FacultyProfile />} />

              {/* Student Only Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/analytics" element={<StudentAnalytics />} />
              <Route path="/student/attendance" element={<AttendanceHistory />} />
              <Route path="/student/devices" element={<RegisteredDevices />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/my-attendance" element={<AttendanceHistory />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
