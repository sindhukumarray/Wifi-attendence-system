import React from 'react';
import LiveCounter from './LiveCounter';
import SessionStatus from './SessionStatus';

const RealtimeStats = ({ totalStudents, presentCount, isActive }) => {
  const attendancePercentage = totalStudents > 0 
    ? Math.round((presentCount / totalStudents) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Active Status Widget */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center">
        <SessionStatus isActive={isActive} />
        <p className="text-slate-500 text-sm font-medium mt-3 text-center">
          {isActive ? 'Accepting attendance payloads...' : 'Session is currently closed.'}
        </p>
      </div>

      {/* Live Counter Widget */}
      <LiveCounter count={presentCount} label="Students Present" />

      {/* Realtime Percentage Widget */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center items-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
        
        <div className="text-4xl font-black relative z-10">
          {attendancePercentage}%
        </div>
        <p className="text-blue-100 text-sm font-semibold mt-1 uppercase tracking-wider relative z-10">
          Attendance Rate
        </p>
      </div>
    </div>
  );
};

export default RealtimeStats;
