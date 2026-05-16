import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStudent from '../../hooks/useStudent';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import AttendanceCard from '../../components/attendance/AttendanceCard';
import AttendanceChart from '../../components/student/AttendanceChart';
import SkeletonLoader from '../../components/student/SkeletonLoader';
import Badge from '../../components/common/Badge';

const StudentDashboard = () => {
  const { loading, dashboardData, fetchDashboard } = useStudent();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboardData) {
    return (
      <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
        <div className="space-y-10">
          <SkeletonLoader type="card" count={4} />
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-[450px] animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  const { attendance_percentage, recent_attendance, profile } = dashboardData || {};

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-10 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time attendance & session tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="primary" className="py-2 px-4 rounded-xl">Academic Year 2024-25</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AttendanceCard 
            title="Attendance Rate" 
            count={`${attendance_percentage?.percentage}%`}
            trend={1.2}
            colorClass="border-blue-50"
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>}
          />
          <AttendanceCard 
            title="Present Sessions" 
            count={attendance_percentage?.present_classes}
            trend={5}
            colorClass="border-green-50"
            icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
          />
          <AttendanceCard 
            title="Absent Sessions" 
            count={attendance_percentage?.total_classes - attendance_percentage?.present_classes}
            trend={-10}
            colorClass="border-red-50"
            icon={<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>}
          />
          <AttendanceCard 
            title="Total Sessions" 
            count={attendance_percentage?.total_classes}
            colorClass="border-slate-50"
            icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          />
        </div>

        {/* Charts & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Trend Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Attendance Trends</h3>
              <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-1.5 focus:ring-0">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <AttendanceChart />
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Recent Activity</h3>
            <div className="space-y-6 flex-1">
              {recent_attendance?.length > 0 ? (
                recent_attendance.map((log, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${log.status?.toLowerCase() === 'present' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">{log.subject_name}</p>
                      <p className="text-xs font-bold text-slate-400">{new Date(log.recorded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <p className="text-slate-400 font-medium">No recent activity found.</p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/student/attendance')}
              className="mt-8 w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              View All History →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
