import React, { useEffect, useState } from 'react';
import useFaculty from '../../hooks/useFaculty';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import StatCard from '../../components/analytics/StatCard';
import { TrendChart, RatioPieChart, ComparisonBarChart } from '../../components/analytics/AnalyticsCharts';
import Badge from '../../components/common/Badge';

const FacultyReports = () => {
  const { dashboardData, fetchDashboard, loading } = useFaculty();
  const [chartData, setChartData] = useState({ daily: [], engagement: [], sessions: [] });

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (!dashboardData?.recentSessions) {
      alert('No data available to export');
      return;
    }
    
    const headers = ['Subject', 'Classroom', 'Date', 'Status'];
    const rows = dashboardData.recentSessions.map(sess => [
      sess.subject_name,
      sess.room_name,
      new Date(sess.start_time).toLocaleDateString(),
      sess.is_active ? 'ACTIVE' : 'COMPLETED'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'faculty_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (dashboardData) {
      // Mock data for faculty analytics
      setChartData({
        daily: [
          { name: 'Mon', value: 70 },
          { name: 'Tue', value: 85 },
          { name: 'Wed', value: 65 },
          { name: 'Thu', value: 90 },
          { name: 'Fri', value: 82 },
        ],
        engagement: [
          { name: 'Active', value: 80 },
          { name: 'Late', value: 15 },
          { name: 'Absent', value: 5 },
        ],
        sessions: [
          { name: 'Room 101', value: 88 },
          { name: 'Room 202', value: 72 },
          { name: 'Lab 1', value: 95 },
        ]
      });
    }
  }, [dashboardData]);

  const stats = dashboardData?.stats || {};

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-10 animate-fade-in p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Insights</h1>
            <p className="text-slate-500 font-medium mt-1">Global performance and classroom analytics</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleExportPDF}
               className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export PDF
             </button>
             <button 
               onClick={handleExportExcel}
               className="px-6 py-3 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-600/20"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2a4 4 0 014-4h4m-4 4l4-4m-4 4l-4-4m12 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Excel Report
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            title="Avg. Class Size" 
            value={stats.avg_attendance || '48'} 
            subtext="Students"
            colorClass="purple"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          />
          <StatCard 
            title="Total Sessions" 
            value={stats.total_sessions || '156'} 
            colorClass="blue"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          />
          <StatCard 
            title="System Health" 
            value="99.9%" 
            colorClass="green"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
          />
          <StatCard 
            title="Flagged Alerts" 
            value="0" 
            colorClass="red"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Department Trends</h3>
                <Badge variant="primary">Realtime</Badge>
             </div>
             <TrendChart data={chartData.daily} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
             <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Student Engagement Ratio</h3>
             <RatioPieChart data={chartData.engagement} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 lg:col-span-2">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Classroom Utilization</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Comparing average attendance by physical room</p>
                </div>
             </div>
             <ComparisonBarChart data={chartData.sessions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyReports;
