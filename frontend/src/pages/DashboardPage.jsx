import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import AttendanceCard from '../components/attendance/AttendanceCard';
import AttendanceTable from '../components/attendance/AttendanceTable';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'student') {
      navigate('/student/dashboard');
    }
  }, [user, navigate]);

  // Temporary UI for Student (while navigating)
  if (user?.role === 'student') {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Loading Student Workspace...</div>;
  }

  // Admin UI (SaaS Overview)
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
              <p className="text-slate-500 font-medium mt-1">Monitor real-time campus attendance</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">Download Report</button>
              <button className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-all">New Session</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <AttendanceCard 
              title="Total Students" 
              count="1,280" 
              trend={12}
              colorClass="border-slate-100" 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
            />
            <AttendanceCard 
              title="Present Today" 
              count="942" 
              trend={5.4}
              colorClass="border-slate-100" 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            />
            <AttendanceCard 
              title="Avg. Attendance" 
              count="84%" 
              trend={-2.1}
              colorClass="border-slate-100" 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
            />
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
              <a href="#" className="text-brand-600 font-bold text-sm hover:underline">View All</a>
            </div>
            <AttendanceTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
