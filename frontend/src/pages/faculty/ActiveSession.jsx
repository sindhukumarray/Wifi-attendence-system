import React, { useEffect } from 'react';
import useFaculty from '../../hooks/useFaculty';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import Badge from '../../components/common/Badge';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';

const ActiveSession = () => {
  const { activeSession, liveAttendance, fetchActiveSession, fetchLiveAttendance, loading } = useFaculty();

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  useEffect(() => {
    if (activeSession) {
      fetchLiveAttendance(activeSession.id);
      // Poll every 10 seconds for live updates
      const interval = setInterval(() => fetchLiveAttendance(activeSession.id), 10000);
      return () => clearInterval(interval);
    }
  }, [activeSession, fetchLiveAttendance]);

  if (loading && !activeSession) {
    return (
      <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
        <div className="p-6 lg:p-10">
          <FacultySkeleton type="table" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <main className="p-6 lg:p-10 space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Attendance</h2>
              {activeSession && <Badge variant="success" className="animate-pulse">ACTIVE</Badge>}
            </div>
            <p className="text-slate-500 font-medium">Monitoring real-time presence for {activeSession?.subject_name || 'No Active Session'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Present Count</p>
              <h4 className="text-2xl font-black text-brand-600">{liveAttendance.length} Students</h4>
            </div>
          </div>
        </div>

        {activeSession ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll Number</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detected Device</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {liveAttendance.length > 0 ? (
                    liveAttendance.map((log) => (
                      <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-sm">
                              {log.student_name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800">{log.student_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-slate-500">{log.roll_no}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-600">{log.mac_address || 'Connected Device'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-500">
                          {new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <Badge variant="success">PRESENT</Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                        No students detected yet. Ensure students have registered their devices.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Session</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">You need to start a lecture session to begin live attendance monitoring.</p>
            <button 
              onClick={() => window.location.href = '/faculty/dashboard'} 
              className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default ActiveSession;
