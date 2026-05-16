import React from 'react';

const AttendanceCard = ({ title, count, colorClass, icon, trend }) => {
  return (
    <div className={`p-6 rounded-3xl shadow-sm border bg-white card-hover relative overflow-hidden group ${colorClass}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-brand-50 transition-colors duration-300">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h4 className="text-slate-500 text-sm font-semibold tracking-tight mb-1">{title}</h4>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black text-slate-800 tracking-tight">{count ?? '—'}</p>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
    </div>
  );
};

export default AttendanceCard;
