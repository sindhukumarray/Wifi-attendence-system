import React from 'react';
import Badge from '../common/Badge';

const SessionCard = ({ session, onEnd, loading }) => {
  if (!session) return null;

  return (
    <div className="bg-[#020617] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-brand-500/30 transition-all duration-700"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/40 relative">
            <span className="absolute inset-0 rounded-2xl bg-brand-600 animate-ping opacity-25"></span>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-black tracking-tight">{session.subject_name}</h3>
              <Badge variant="success" className="bg-green-500/20 text-green-400 border-none animate-pulse">LIVE NOW</Badge>
            </div>
            <p className="text-slate-400 font-bold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {session.room_name}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Started at {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <button 
            onClick={() => onEnd(session.id)}
            disabled={loading}
            className="px-8 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? 'Closing...' : (
              <span className="flex items-center gap-2">
                Stop Session
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
