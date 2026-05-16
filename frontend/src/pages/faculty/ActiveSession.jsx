import React, { useEffect, useState } from 'react';
import useFaculty from '../../hooks/useFaculty';
import { useSocket } from '../../context/SocketContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import Badge from '../../components/common/Badge';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';
import LiveAttendanceFeed from '../../components/realtime/LiveAttendanceFeed';
import LiveStatsWidget from '../../components/realtime/LiveStatsWidget';
import { toast } from 'react-hot-toast';

const ActiveSession = () => {
  const { activeSession, liveAttendance, fetchActiveSession, fetchLiveAttendance, loading } = useFaculty();
  const { socket, isConnected } = useSocket();
  const [realtimeAttendance, setRealtimeAttendance] = useState([]);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  useEffect(() => {
    if (activeSession) {
      fetchLiveAttendance(activeSession.id);
    }
  }, [activeSession, fetchLiveAttendance]);

  useEffect(() => {
    if (liveAttendance.length > 0) {
      setRealtimeAttendance(liveAttendance);
      setLiveCount(liveAttendance.length);
    }
  }, [liveAttendance]);

  // Socket Integration
  useEffect(() => {
    if (socket && activeSession) {
      console.log(`🔌 Joining session room: session_${activeSession.id}`);
      socket.emit('join_session', activeSession.id);

      const handleAttendanceUpdate = (data) => {
        console.log('⚡ Realtime Update Received:', data);
        if (data.sessionId === activeSession.id) {
          // Prepend new students to the feed
          setRealtimeAttendance(prev => [...data.newStudents, ...prev]);
          setLiveCount(data.totalCount);
          
          // Show toast for each new student
          data.newStudents.forEach(student => {
            toast.success(`${student.student_name} is Present`, {
              icon: '👋',
              style: {
                borderRadius: '16px',
                background: '#333',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold'
              }
            });
          });
        }
      };

      socket.on('attendance_updated', handleAttendanceUpdate);

      return () => {
        socket.off('attendance_updated', handleAttendanceUpdate);
      };
    }
  }, [socket, activeSession]);

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
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {isConnected ? 'System Online' : 'Connecting...'}
               </span>
             </div>
          </div>
        </div>

        {activeSession ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-[calc(100vh-250px)]">
            {/* Left Column: Stats & Session Info */}
            <div className="lg:col-span-1 space-y-6">
              <LiveStatsWidget 
                count={liveCount}
                label="Present Students"
                colorClass="bg-brand-50 text-brand-600"
                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
              />
              
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Session Details</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Classroom</label>
                      <p className="text-xl font-bold">{activeSession.room_name}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Started At</label>
                      <p className="text-lg font-medium opacity-80">{new Date(activeSession.start_time).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                </div>
              </div>
            </div>

            {/* Right Column: Live Feed */}
            <div className="lg:col-span-2">
              <LiveAttendanceFeed attendance={realtimeAttendance} />
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">No Active Monitoring</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">Start a lecture session from your dashboard to begin realtime attendance tracking.</p>
            <button 
              onClick={() => window.location.href = '/faculty/dashboard'} 
              className="px-10 py-4 bg-brand-600 text-white font-black rounded-2xl shadow-xl shadow-brand-600/25 hover:bg-brand-700 transition-all active:scale-95"
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
