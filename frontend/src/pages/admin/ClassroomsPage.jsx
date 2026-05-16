import React, { useEffect, useState } from 'react';
import useAdmin from '../../hooks/useAdmin';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';
import Badge from '../../components/common/Badge';

const ClassroomsPage = () => {
  const { loading, classrooms, fetchClassrooms, deleteRecord } = useAdmin();

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      const success = await deleteRecord('classroom', id);
      if (success) fetchClassrooms();
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Spaces</h1>
            <p className="text-slate-500 font-medium mt-1">Configure Wi-Fi SSIDs and physical classroom mappings</p>
          </div>
          <button className="px-8 py-4 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 transition-all flex items-center gap-2 shadow-xl shadow-brand-600/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
            Add New Room
          </button>
        </div>

        {loading ? (
          <FacultySkeleton type="grid" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classrooms.map((room) => (
              <div key={room.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:scale-[1.02] transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-brand-100 transition-all"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <Badge variant="primary" className="uppercase font-black tracking-widest text-[10px]">
                      {room.capacity || '50'} Seats
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-2">{room.room_name}</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.393 8.393a16 16 0 0121.214 0"></path></svg>
                      Network SSID
                    </div>
                    <code className="bg-slate-50 px-4 py-2 rounded-xl text-brand-600 font-black border border-slate-100 inline-block w-fit">
                      {room.wifi_ssid}
                    </code>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-slate-50">
                    <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-slate-600 transition-all">
                      Edit Config
                    </button>
                    <button 
                      onClick={() => handleDelete(room.id)}
                      className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassroomsPage;
