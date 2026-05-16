import React, { useEffect, useState } from 'react';
import useAdmin from '../../hooks/useAdmin';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';

const StudentsPage = () => {
  const { loading, students, fetchStudents, createRecord, deleteRecord } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', roll_no: '' });

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    const success = await createRecord('student', form);
    if (success) {
      setShowModal(false);
      setForm({ name: '', email: '', password: '', roll_no: '' });
      fetchStudents();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      const success = await deleteRecord('student', id);
      if (success) fetchStudents();
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Management</h1>
            <p className="text-slate-500 font-medium mt-1">Manage all registered student accounts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 transition-all flex items-center gap-2 shadow-xl shadow-brand-600/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
            Add New Student
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, or roll number..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {loading ? (
          <FacultySkeleton type="table" />
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                    <th className="px-8 py-6">Student Name</th>
                    <th className="px-8 py-6">Roll No</th>
                    <th className="px-8 py-6">Email</th>
                    <th className="px-8 py-6">Joined</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center font-bold text-brand-600 group-hover:bg-brand-100 transition-all">
                            {s.name?.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-slate-600 font-bold">{s.roll_no}</td>
                      <td className="px-8 py-6 text-slate-500 font-medium">{s.email}</td>
                      <td className="px-8 py-6 text-slate-400 text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-medium">No students found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-400">Total Students: <span className="text-slate-600 font-bold">{students.length}</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-10 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Add New Student</h2>
            <p className="text-slate-500 font-medium text-sm mb-8">Create a new student account</p>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Roll Number</label>
                <input type="text" required value={form.roll_no} onChange={(e) => setForm({ ...form, roll_no: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium" placeholder="CS2024-001" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium" placeholder="student@college.com" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium" placeholder="••••••••" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20">
                  {loading ? 'Creating...' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentsPage;
