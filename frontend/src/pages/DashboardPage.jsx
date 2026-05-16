import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import AttendanceCard from '../components/attendance/AttendanceCard';
import AttendanceTable from '../components/attendance/AttendanceTable';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';
import FacultySkeleton from '../components/faculty/FacultySkeleton';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, dashboardData, fetchDashboard } = useAdmin();

  useEffect(() => {
    if (user?.role === 'student') {
      navigate('/student/dashboard');
    } else if (user?.role === 'faculty') {
      navigate('/faculty/dashboard');
    } else if (user?.role === 'admin') {
      fetchDashboard();
    }
  }, [user, navigate, fetchDashboard]);

  // Temporary UI for Student/Faculty (while navigating)
  if (user?.role !== 'admin') {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading Workspace...</div>;
  }

  // Admin UI (SaaS Overview)
  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Monitor real-time campus attendance</p>
          </div>
        </div>

        {loading ? (
          <FacultySkeleton type="dashboard" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <AttendanceCard 
                title="Total Students" 
                count={dashboardData?.stats?.totalStudents || 0} 
                trend={dashboardData?.stats?.trendStudents}
                colorClass="border-slate-100" 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
              />
              <AttendanceCard 
                title="Present Today" 
                count={dashboardData?.stats?.presentToday || 0} 
                trend={dashboardData?.stats?.trendPresent}
                colorClass="border-slate-100" 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
              />
              <AttendanceCard 
                title="Avg. Attendance" 
                count={`${dashboardData?.stats?.avgAttendance || 0}%`} 
                trend={dashboardData?.stats?.trendAvg}
                colorClass="border-slate-100" 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
              />
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
              </div>
              <AttendanceTable data={dashboardData?.recentActivity || []} />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
