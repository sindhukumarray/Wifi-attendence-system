import React from 'react';

const AttendanceTable = () => {
  const dummyData = [
    { id: 1, name: 'Alice Smith', mac: '00:1A:2B:3C', status: 'Present', time: '08:45 AM' },
    { id: 2, name: 'Bob Johnson', mac: 'AA:BB:CC:DD', status: 'Absent', time: '-' },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="uppercase tracking-wider border-b-2 border-gray-100 bg-gray-50 text-gray-600 font-semibold">
          <tr>
            <th className="px-6 py-4">Student</th>
            <th className="px-6 py-4">MAC Address</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {dummyData.map((row) => (
            <tr key={row.id} className="hover:bg-blue-50/60 cursor-pointer transition-all duration-200 group">
              <td className="px-6 py-4 font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{row.name}</td>
              <td className="px-6 py-4 text-slate-500 font-mono text-xs">{row.mac}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm transition-transform duration-300 group-hover:scale-105 inline-block ${
                  row.status === 'Present' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 font-medium">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
