import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a full screen loader while AuthContext verifies the JWT in localStorage
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in -> Redirect to login page and save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role -> Redirect to appropriate dashboard
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                         user.role === 'faculty' ? '/faculty/dashboard' : 
                         '/dashboard'; // default student dashboard
    return <Navigate to={redirectPath} replace />;
  }

  // Authenticated and authorized -> Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
