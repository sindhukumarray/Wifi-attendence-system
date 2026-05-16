import React from 'react';

const LiveStatsWidget = ({ count, label, icon, colorClass }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight animate-scale-up" key={count}>
            {count}
          </h3>
        </div>
        <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
};

export default LiveStatsWidget;
