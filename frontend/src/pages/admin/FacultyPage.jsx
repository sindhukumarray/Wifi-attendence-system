import React, { useEffect, useState } from 'react';
import useAdmin from '../../hooks/useAdmin';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';

const FacultyPage = () => {
  const { loading, faculty, fetchFaculty, deleteRecord } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      const success = await deleteRecord('faculty', id);
      if (success) fetchFaculty();
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Management</h1>
            <p className="text-slate-500 font-medium mt-1">Manage teaching staff and department assignments</p>
          </div>
          <button className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
            Add New Faculty
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <input 
            type="text" 
            placeholder="Search by name or email..."
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
                    <th className="px-8 py-6">Faculty Name</th>
                    <th className="px-8 py-6">Email Address</th>
                    <th className="px-8 py-6">Department</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFaculty.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-all">
                            {f.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800">{f.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-medium">{f.email}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase">
                          {f.department_name || 'General'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-emerald-600 font-bold text-xs uppercase">Active</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(f.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyPage;
