import React from 'react';

const StatCard = ({ title, value, subtext, icon, trend, colorClass = "blue" }) => {
  const colors = {
    blue: "from-blue-600 to-indigo-700 shadow-blue-200",
    green: "from-emerald-600 to-teal-700 shadow-emerald-200",
    red: "from-rose-600 to-pink-700 shadow-rose-200",
    purple: "from-violet-600 to-purple-700 shadow-violet-200"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[colorClass]} p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16 rounded-full group-hover:bg-white/20 transition-all"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            {icon}
          </div>
          {trend && (
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black">
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>

        <div>
          <p className="text-white/70 text-sm font-black uppercase tracking-widest mb-1">{title}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black tracking-tight">{value}</h3>
            {subtext && <span className="text-white/60 font-bold text-sm mb-1">{subtext}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
