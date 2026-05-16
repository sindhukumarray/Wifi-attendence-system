import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './routes/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy Loaded Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const AttendanceHistory = lazy(() => import('./pages/student/AttendanceHistory'));
const RegisteredDevices = lazy(() => import('./pages/student/RegisteredDevices'));
const StudentAnalytics = lazy(() => import('./pages/student/StudentAnalytics'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));

// Faculty Pages
const FacultyDashboard = lazy(() => import('./pages/faculty/FacultyDashboard'));
const ActiveSession = lazy(() => import('./pages/faculty/ActiveSession'));
const FacultyReports = lazy(() => import('./pages/faculty/FacultyReports'));
const FacultyProfile = lazy(() => import('./pages/faculty/FacultyProfile'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const StudentsPage = lazy(() => import('./pages/admin/StudentsPage'));
const FacultyPage = lazy(() => import('./pages/admin/FacultyPage'));
const ClassroomsPage = lazy(() => import('./pages/admin/ClassroomsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Interface...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  
                  {/* Admin Only Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/students" element={<StudentsPage />} />
                  <Route path="/admin/faculty" element={<FacultyPage />} />
                  <Route path="/admin/classrooms" element={<ClassroomsPage />} />
                  <Route path="/admin/settings" element={<SettingsPage />} />

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
            </Suspense>
            <Toaster position="top-right" />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
