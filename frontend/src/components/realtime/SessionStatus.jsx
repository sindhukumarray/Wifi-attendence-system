import React from 'react';

const SessionStatus = ({ isActive }) => {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
      isActive 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        : 'bg-slate-100 text-slate-600 border-slate-200'
    }`}>
      <span className="relative flex h-2.5 w-2.5 mr-2">
        {isActive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
      </span>
      {isActive ? 'Live Session' : 'Offline'}
    </div>
  );
};

export default SessionStatus;
