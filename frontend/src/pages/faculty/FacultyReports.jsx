import React, { useEffect, useState } from 'react';
import useFaculty from '../../hooks/useFaculty';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import Badge from '../../components/common/Badge';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';
import { toast } from 'react-hot-toast';

const FacultyReports = () => {
  const { loading, reports, subjects, fetchReports, fetchAcademicData } = useFaculty();
  const [filters, setFilters] = useState({ subject_id: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetchAcademicData();
    fetchReports({});
  }, [fetchAcademicData, fetchReports]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    fetchReports(newFilters);
  };

  const handleExportCSV = () => {
    if (reports.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Student Name', 'Roll Number', 'Subject', 'Date', 'Time', 'Status'];
    const csvRows = [
      headers.join(','),
      ...reports.map(log => [
        `"${log.student_name}"`,
        `"${log.roll_no}"`,
        `"${log.subject_name}"`,
        `"${new Date(log.start_time).toLocaleDateString()}"`,
        `"${new Date(log.recorded_at).toLocaleTimeString()}"`,
        'Present'
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <main className="p-6 lg:p-10 space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Reports</h2>
            <p className="text-slate-500 font-medium mt-1">Analyze and export lecture attendance history</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export CSV
          </button>
        </div>

        {/* Filters Area */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Subject</label>
            <select 
              name="subject_id"
              value={filters.subject_id}
              onChange={handleFilterChange}
              className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
            <input 
              type="date" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
            <input 
              type="date" 
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <FacultySkeleton type="table" />
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.length > 0 ? (
                    reports.map((log) => (
                      <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-800">{log.student_name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">{log.roll_no}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-semibold text-slate-600">{log.subject_name}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-medium text-slate-500">{new Date(log.start_time).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold text-slate-400">{new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <Badge variant="success">PRESENT</Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                        No records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default FacultyReports;
