import React, { useEffect } from 'react';
import useStudent from '../../hooks/useStudent';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import SkeletonLoader from '../../components/student/SkeletonLoader';
import Badge from '../../components/common/Badge';

const AttendanceHistory = () => {
  const { loading, attendance, fetchAttendance } = useStudent();

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendance History</h2>
          <p className="text-slate-500 font-medium mt-1">View your complete lecture attendance logs</p>
        </div>

        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Subject</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Faculty</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Date & Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendance.length > 0 ? (
                    attendance.map((log) => (
                      <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{log.subject_name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">{log.subject_code}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 font-bold text-xs">
                              {log.faculty_name?.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-600 text-sm">{log.faculty_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-slate-700">{new Date(log.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-xs font-medium text-slate-400">{new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <Badge variant={log.status.toLowerCase() === 'present' ? 'success' : 'danger'}>
                            {log.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                        No attendance records found. Start attending classes to see your logs!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendanceHistory;
