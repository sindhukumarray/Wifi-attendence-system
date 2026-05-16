import React, { useEffect } from 'react';
import useFaculty from '../../hooks/useFaculty';
import useSocket from '../../hooks/useSocket';
import useRealtimeAttendance from '../../hooks/useRealtimeAttendance';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import Badge from '../../components/common/Badge';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';
import LiveAttendanceFeed from '../../components/realtime/LiveAttendanceFeed';
import RealtimeStats from '../../components/realtime/RealtimeStats';

const ActiveSession = () => {
  const { activeSession, liveAttendance, fetchActiveSession, fetchLiveAttendance, loading } = useFaculty();
  const { socketService, isConnected } = useSocket();

  // 1. Initial REST Data Load
  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  useEffect(() => {
    if (activeSession) {
      fetchLiveAttendance(activeSession.id);
    }
  }, [activeSession, fetchLiveAttendance]);

  // 2. Setup Realtime Room Connection
  useEffect(() => {
    if (activeSession && isConnected) {
      socketService.joinSessionRoom(activeSession.id);
      
      return () => {
        socketService.leaveSessionRoom(activeSession.id);
      };
    }
  }, [activeSession, isConnected, socketService]);

  // 3. Connect UI to Realtime Hooks
  const { attendanceList, totalCount } = useRealtimeAttendance(
    activeSession?.id, 
    liveAttendance
  );

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
      <main className="p-6 lg:p-10 space-y-10 animate-fade-in max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Realtime Monitor</h2>
              {activeSession && <Badge variant="success" className="animate-pulse px-3 py-1">LIVE</Badge>}
              {!isConnected && <Badge variant="secondary" className="bg-red-50 text-red-500 border-red-100 uppercase tracking-widest text-[10px]">Disconnected</Badge>}
            </div>
            <p className="text-slate-500 font-medium">Monitoring presence for <span className="text-brand-600 font-bold">{activeSession?.subject_name || 'No Active Session'}</span></p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Connection Status Indicator */}
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
               <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500 animate-pulse'}`}></div>
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                 {isConnected ? 'Socket Online' : 'Connecting...'}
               </span>
             </div>
          </div>
        </div>

        {activeSession ? (
          <>
            {/* Top Row: Realtime Widgets */}
            <RealtimeStats 
              totalStudents={activeSession.total_enrolled || 100} // Mock total for now until backend provides it
              presentCount={totalCount}
              isActive={activeSession.is_active}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column: Session Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group h-full">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Session Details</p>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Classroom</label>
                        <p className="text-2xl font-black mt-1">{activeSession.room_name}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Subject Code</label>
                        <p className="text-xl font-bold mt-1 text-blue-400">{activeSession.subject_code || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Started At</label>
                        <p className="text-lg font-medium opacity-80 mt-1">{new Date(activeSession.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                    <svg className="w-48 h-48 -mr-10 -mt-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Feed */}
              <div className="lg:col-span-2">
                <LiveAttendanceFeed attendanceList={attendanceList} />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-100 shadow-sm rounded-[3rem] p-24 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">No Active Monitoring</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">Start a lecture session from your dashboard to begin realtime attendance tracking.</p>
            <button 
              onClick={() => window.location.href = '/faculty/dashboard'} 
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-95"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default ActiveSession;
