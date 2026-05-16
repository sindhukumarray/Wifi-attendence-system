import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStudent from '../../hooks/useStudent';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import SkeletonLoader from '../../components/student/SkeletonLoader';
import Badge from '../../components/common/Badge';

const AttendanceHistory = () => {
  const { loading, attendance, fetchAttendance } = useStudent();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance History</h1>
            <p className="text-slate-500 font-medium mt-1">Your complete lecture attendance log</p>
          </div>
          {attendance.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-500">
                <span className="text-slate-800">{attendance.filter(l => (l.status || 'present').toLowerCase() === 'present').length}</span>
                /{attendance.length} present
              </span>
              <div className="h-6 w-px bg-slate-200" />
              <span className="text-sm font-black text-brand-600">
                {attendance.length > 0
                  ? ((attendance.filter(l => (l.status || 'present').toLowerCase() === 'present').length / attendance.length) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {attendance.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {attendance.map((log, idx) => {
                        const status = (log.status || 'present').toLowerCase();
                        const isPresent = status === 'present';
                        return (
                          <tr key={log.id ?? idx} className="group hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-5">
                              <span className="text-xs font-bold text-slate-300">{idx + 1}</span>
                            </td>
                            <td className="px-6 py-5">
                              <p className="font-bold text-slate-800 text-sm group-hover:text-brand-600 transition-colors">
                                {log.subject_name}
                              </p>
                              {log.subject_code && (
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide mt-0.5">
                                  {log.subject_code}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 font-black text-xs shrink-0">
                                  {log.faculty_name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span className="text-sm font-semibold text-slate-600">{log.faculty_name || '—'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-bold text-slate-700">
                                {new Date(log.recorded_at).toLocaleDateString('en-IN', {
                                  day: '2-digit', month: 'short', year: 'numeric'
                                })}
                              </p>
                              <p className="text-xs font-medium text-slate-400 mt-0.5">
                                {new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <Badge variant={isPresent ? 'success' : 'danger'}>
                                {status.toUpperCase()}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-400">
                    Showing <span className="text-slate-600 font-bold">{attendance.length}</span> record{attendance.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-700 mb-1">No records yet</h3>
                <p className="text-sm text-slate-400 font-medium">
                  Start attending sessions to see your history here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendanceHistory;
