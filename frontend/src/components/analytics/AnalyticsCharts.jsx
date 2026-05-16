import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl">
        <p className="text-white font-black text-sm mb-1">{label}</p>
        <p className="text-brand-400 font-bold text-xs">
          Attendance: <span className="text-white">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const TrendChart = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 2 }} />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#3b82f6" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorTrend)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const ComparisonBarChart = ({ data }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} 
        />
        <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill="#6366f1" 
          radius={[8, 8, 0, 0]} 
          barSize={40}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const RatioPieChart = ({ data }) => {
  const COLORS = ['#10b981', '#f43f5e', '#6366f1', '#f59e0b'];
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={8}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value) => <span className="text-slate-600 font-bold text-sm ml-2">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
