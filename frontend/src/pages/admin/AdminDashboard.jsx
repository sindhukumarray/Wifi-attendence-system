import React, { useEffect } from 'react';
import useAdmin from '../../hooks/useAdmin';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import StatCard from '../../components/analytics/StatCard';
import { TrendChart, ComparisonBarChart } from '../../components/analytics/AnalyticsCharts';
import Badge from '../../components/common/Badge';

const AdminDashboard = () => {
  const { dashboardData, analyticsData, fetchDashboard, loading } = useAdmin();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = dashboardData || {
    total_students: 0,
    total_faculty: 0,
    active_sessions: 0,
    system_health: '99.9%'
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-10 animate-fade-in p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Institutional performance and management hub</p>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant="success" className="py-2 px-4 rounded-xl text-xs font-black uppercase tracking-widest">
               System Live
             </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            title="Total Students" 
            value={stats.total_students} 
            trend={12}
            colorClass="blue"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
          />
          <StatCard 
            title="Total Faculty" 
            value={stats.total_faculty} 
            colorClass="purple"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
          />
          <StatCard 
            title="Active Sessions" 
            value={stats.active_sessions} 
            colorClass="green"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
          />
          <StatCard 
            title="System Health" 
            value={stats.system_health} 
            colorClass="blue"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Attendance Volume Trend</h3>
            <TrendChart data={analyticsData?.trends || [
              { name: 'Week 1', value: 0 },
              { name: 'Week 2', value: 0 },
              { name: 'Week 3', value: 0 },
              { name: 'Week 4', value: 0 },
            ]} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Department Participation</h3>
            <ComparisonBarChart data={analyticsData?.department_participation || [
              { name: 'CS', value: 0 },
              { name: 'IT', value: 0 },
              { name: 'EE', value: 0 },
              { name: 'ME', value: 0 },
            ]} />
          </div>
        </div>

        {/* Management Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer">
              <h4 className="text-lg font-black tracking-tight mb-4 text-white/70">STUDENTS</h4>
              <p className="text-2xl font-black mb-6">Manage Enrollment</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold transition-all">Open Registry</button>
           </div>
           <div className="bg-brand-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer">
              <h4 className="text-lg font-black tracking-tight mb-4 text-white/70">FACULTY</h4>
              <p className="text-2xl font-black mb-6">Assign Subjects</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold transition-all">View Staff</button>
           </div>
           <div className="bg-purple-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer">
              <h4 className="text-lg font-black tracking-tight mb-4 text-white/70">SESSIONS</h4>
              <p className="text-2xl font-black mb-6">Monitor Live</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold transition-all">Enter Control Panel</button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
