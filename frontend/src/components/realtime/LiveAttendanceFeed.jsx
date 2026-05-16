import React from 'react';
import Badge from '../common/Badge';

const LiveAttendanceFeed = ({ attendance }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-slate-50">
        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Live Presence Feed
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {attendance.length > 0 ? (
          attendance.map((log, index) => (
            <div 
              key={log.id || index} 
              className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 animate-fade-in group hover:bg-white hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-brand-600 shadow-sm border border-slate-100">
                  {log.student_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{log.student_name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{log.roll_no}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400">
                  {new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <Badge variant="success" className="mt-1">PRESENT</Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-500 italic">Waiting for students to connect...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAttendanceFeed;
