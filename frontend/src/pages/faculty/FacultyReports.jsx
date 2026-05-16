import React, { useEffect, useState, useMemo } from 'react';
import useFaculty from '../../hooks/useFaculty';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import Badge from '../../components/common/Badge';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';
import { toast } from 'react-hot-toast';

/* ────────────────────────────────────────────────
   Small stat card
──────────────────────────────────────────────── */
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

/* ────────────────────────────────────────────────
   Main component
──────────────────────────────────────────────── */
const FacultyReports = () => {
  const { loading, reports, subjects, fetchReports, fetchAcademicData } = useFaculty();
  const [filters, setFilters] = useState({ subject_id: '', startDate: '', endDate: '' });

  // ── Fetch on mount only — both are stable useCallback refs now ──────────
  useEffect(() => {
    fetchAcademicData();
    fetchReports({});
  }, [fetchAcademicData, fetchReports]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const uniqueStudents = new Set(reports.map(r => r.roll_no)).size;
    const uniqueSessions = new Set(reports.map(r => r.session_id)).size;
    return {
      total: reports.length,
      students: uniqueStudents,
      sessions: uniqueSessions,
    };
  }, [reports]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };

    // Prevent endDate < startDate
    if (name === 'endDate' && newFilters.startDate && value < newFilters.startDate) {
      toast.error('End date cannot be before start date');
      return;
    }
    if (name === 'startDate' && newFilters.endDate && value > newFilters.endDate) {
      toast.error('Start date cannot be after end date');
      return;
    }

    setFilters(newFilters);
    fetchReports(newFilters);
  };

  const handleClearFilters = () => {
    const cleared = { subject_id: '', startDate: '', endDate: '' };
    setFilters(cleared);
    fetchReports({});
  };

  const handleExportCSV = () => {
    if (reports.length === 0) { toast.error('No data to export'); return; }

    const headers = ['Student Name', 'Roll Number', 'Subject', 'Session Date', 'Marked At', 'Status'];
    const rows = reports.map(log => [
      `"${log.student_name}"`,
      `"${log.roll_no}"`,
      `"${log.subject_name}"`,
      `"${new Date(log.start_time).toLocaleDateString()}"`,
      `"${new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}"`,
      'Present',
    ].join(','));

    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url, download: `attendance_${new Date().toISOString().split('T')[0]}.csv`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = filters.subject_id || filters.startDate || filters.endDate;

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Reports</h1>
            <p className="text-slate-500 font-medium mt-1">Analyze and export lecture attendance history</p>
          </div>
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            disabled={reports.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────── */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Records"
              value={stats.total}
              color="bg-brand-50 text-brand-600"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <StatCard
              label="Unique Students"
              value={stats.students}
              color="bg-emerald-50 text-emerald-600"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                </svg>
              }
            />
            <StatCard
              label="Sessions"
              value={stats.sessions}
              color="bg-violet-50 text-violet-600"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
        )}

        {/* ── Filters ────────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter Records</p>
            {hasActiveFilters && (
              <button
                id="clear-filters-btn"
                onClick={handleClearFilters}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
              <select
                id="filter-subject"
                name="subject_id"
                value={filters.subject_id}
                onChange={handleFilterChange}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all text-sm"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.subject_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
              <input
                id="filter-start-date"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</label>
              <input
                id="filter-end-date"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                min={filters.startDate || undefined}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────── */}
        {loading ? (
          <FacultySkeleton type="table" />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {reports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Marked At</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reports.map((log, idx) => (
                      <tr key={log.id ?? idx} className="group hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-300">{idx + 1}</span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-800 text-sm">{log.student_name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide mt-0.5">{log.roll_no}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-slate-600">{log.subject_name}</span>
                          {log.subject_code && (
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{log.subject_code}</p>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-medium text-slate-500">
                            {new Date(log.start_time).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <Badge variant="success">PRESENT</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer row count */}
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-400">
                    Showing <span className="text-slate-600 font-bold">{reports.length}</span> record{reports.length !== 1 ? 's' : ''}
                    {hasActiveFilters && ' (filtered)'}
                  </p>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-700 mb-1">No records found</h3>
                <p className="text-sm text-slate-400 font-medium">
                  {hasActiveFilters
                    ? 'No attendance matches the selected filters. Try clearing or adjusting them.'
                    : 'No attendance has been recorded yet. Start a session to begin tracking.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyReports;
