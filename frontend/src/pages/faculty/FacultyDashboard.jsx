import React, { useEffect, useState } from 'react';
import useFaculty from '../../hooks/useFaculty';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import SessionCard from '../../components/faculty/SessionCard';
import StatWidget from '../../components/faculty/StatWidget';
import StartSessionModal from '../../components/faculty/StartSessionModal';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';
import Badge from '../../components/common/Badge';

const FacultyDashboard = () => {
  const { 
    loading, 
    dashboardData, 
    activeSession, 
    subjects, 
    classrooms,
    fetchDashboard, 
    fetchAcademicData,
    startSession,
    endSession 
  } = useFaculty();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchAcademicData();
  }, [fetchDashboard, fetchAcademicData]);

  const handleStartSession = async (data) => {
    const success = await startSession(data);
    if (success) setIsModalOpen(false);
  };

  if (loading && !dashboardData) {
    return (
      <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
        <div className="p-6 lg:p-10">
          <FacultySkeleton type="dashboard" />
        </div>
      </DashboardLayout>
    );
  }

  const { stats, recentSessions } = dashboardData || {};

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <main className="p-6 lg:p-10 space-y-10 animate-fade-in">
        {/* Smart Insight Bar */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-brand-600/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-white/20 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Smart Suggestion</h3>
                <p className="text-brand-100 font-medium">
                  {activeSession 
                    ? `You are currently teaching ${activeSession.subject_name}.` 
                    : subjects.length > 0 
                      ? `Ready to start your session? Usually you teach '${subjects[0].subject_name}'.`
                      : "Ready to start your session? Select a subject and classroom."}
                </p>
              </div>
            </div>
            {!activeSession && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-white text-brand-600 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Quick Start
              </button>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Dashboard</h2>
            <p className="text-slate-500 font-medium mt-1">Manage your active sessions and student presence</p>
          </div>
          {!activeSession && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-brand-600 text-white font-black rounded-2xl shadow-xl shadow-brand-600/25 hover:bg-brand-700 transition-all flex items-center gap-3 group"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Start New Lecture
            </button>
          )}
        </div>


        {/* Active Session Notification */}
        {activeSession && (
          <SessionCard 
            session={activeSession} 
            onEnd={endSession}
            loading={loading}
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatWidget 
            title="Total Sessions" 
            count={stats?.total_sessions || 0}
            colorClass="bg-blue-50 text-blue-600"
            icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          />
          <StatWidget 
            title="Total Student Visits" 
            count={stats?.total_attendance || 0}
            colorClass="bg-purple-50 text-purple-600"
            icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          />
          <StatWidget 
            title="Avg. Performance" 
            count="82%"
            colorClass="bg-green-50 text-green-600"
            icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
          />
        </div>

        {/* Recent History Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Sessions</h3>
            <button className="text-sm font-bold text-brand-600 hover:underline">View Full Reports</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classroom</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSessions?.map(sess => (
                  <tr key={sess.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-800">{sess.subject_name}</td>
                    <td className="px-8 py-6 text-sm font-semibold text-slate-600">{sess.room_name}</td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{new Date(sess.start_time).toLocaleDateString()}</td>
                    <td className="px-8 py-6">
                      <Badge variant={sess.is_active ? 'success' : 'secondary'}>
                        {sess.is_active ? 'ACTIVE' : 'COMPLETED'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <StartSessionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          subjects={subjects}
          classrooms={classrooms}
          onStart={handleStartSession}
          loading={loading}
        />
      </main>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
