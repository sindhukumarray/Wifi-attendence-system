import React, { useEffect, useState } from 'react';
import useStudent from '../../hooks/useStudent';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import StatCard from '../../components/analytics/StatCard';
import { TrendChart, RatioPieChart, ComparisonBarChart } from '../../components/analytics/AnalyticsCharts';
import Badge from '../../components/common/Badge';

const StudentAnalytics = () => {
  const { dashboardData, fetchDashboard, loading } = useStudent();
  const [chartData, setChartData] = useState({ trend: [], ratio: [], subjects: [] });

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (dashboardData) {
      // Mock data transformations for visualization demo
      // In production, these would come from specialized analytics endpoints
      setChartData({
        trend: [
          { name: 'Mon', value: 85 },
          { name: 'Tue', value: 92 },
          { name: 'Wed', value: 78 },
          { name: 'Thu', value: 95 },
          { name: 'Fri', value: 88 },
          { name: 'Sat', value: 100 },
          { name: 'Sun', value: 0 },
        ],
        ratio: [
          { name: 'Present', value: dashboardData.attendance_percentage.present_classes },
          { name: 'Absent', value: dashboardData.attendance_percentage.total_classes - dashboardData.attendance_percentage.present_classes },
        ],
        subjects: [
          { name: 'DBMS', value: 90 },
          { name: 'Web Dev', value: 85 },
          { name: 'OS', value: 70 },
          { name: 'Networks', value: 95 },
        ]
      });
    }
  }, [dashboardData]);

  const stats = dashboardData?.attendance_percentage || {};

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-10 animate-fade-in p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personal Analytics</h1>
            <p className="text-slate-500 font-medium mt-1">Deep dive into your academic presence</p>
          </div>
          <Badge variant="primary" className="py-2 px-6 rounded-2xl text-sm font-black uppercase">Phase 7: Advanced Visualization</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            title="Avg. Attendance" 
            value={`${stats.percentage || 0}%`} 
            trend={2.5}
            colorClass="blue"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
          />
          <StatCard 
            title="Present Days" 
            value={stats.present_classes || 0} 
            subtext="Sessions"
            colorClass="green"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          />
          <StatCard 
            title="Eligibility" 
            value={stats.percentage >= 75 ? 'Qualified' : 'Shortage'} 
            colorClass={stats.percentage >= 75 ? "purple" : "red"}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
          />
          <StatCard 
            title="Target" 
            value="75%" 
            subtext="Required"
            colorClass="blue"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Weekly Presence Trend</h3>
            <TrendChart data={chartData.trend} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Subject-wise Analysis</h3>
            <ComparisonBarChart data={chartData.subjects} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Presence Ratio</h3>
            <RatioPieChart data={chartData.ratio} />
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
             <h3 className="text-2xl font-black tracking-tight mb-4 relative z-10">Smart Recommendation</h3>
             <p className="text-slate-400 font-medium leading-relaxed relative z-10">
               {stats.percentage < 75 
                 ? `You are currently ${75 - stats.percentage}% below the required threshold. Attend the next 5 sessions consecutively to regain eligibility.`
                 : "Excellent! You are well above the 75% requirement. Keep up this consistency to maintain your academic standing."}
             </p>
             <button className="mt-8 px-8 py-4 bg-white text-slate-900 font-black rounded-2xl w-fit hover:scale-105 transition-all relative z-10">
               Download Full Report
             </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAnalytics;
