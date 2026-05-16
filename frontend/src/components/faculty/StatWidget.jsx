import React from 'react';

const StatWidget = ({ title, count, icon, colorClass }) => {
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-current/10`}>
          {icon}
        </div>
        <div className="h-2 w-8 bg-slate-50 rounded-full"></div>
      </div>
      <div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{count}</h3>
      </div>
    </div>
  );
};

export default StatWidget;
