import React from 'react';

const LiveAttendanceFeed = ({ attendanceList }) => {
  if (!attendanceList || attendanceList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-700">Waiting for Students</h3>
        <p className="text-slate-500 mt-1 max-w-sm">No attendance has been recorded for this session yet. Waiting for devices to connect...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Live Attendance Feed</h3>
        <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Auto-updating
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
        <div className="space-y-2">
          {attendanceList.map((record, index) => (
            <div 
              key={record.id} 
              className={`flex items-center justify-between p-4 rounded-xl border ${index === 0 ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-100'} transition-all hover:bg-slate-50`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                  {record.student_name ? record.student_name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{record.student_name}</h4>
                  <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">{record.roll_no}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                  {record.status || 'Present'}
                </span>
                <span className="text-xs text-slate-400 mt-1.5 font-medium">
                  {new Date(record.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveAttendanceFeed;
