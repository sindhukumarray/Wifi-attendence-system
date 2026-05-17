import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';

const SettingsPage = () => {
  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in max-w-4xl">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Configure global application parameters</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">System Name</label>
              <input type="text" defaultValue="SmartFlow Attendance" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Session Timeout (Minutes)</label>
              <input type="number" defaultValue="60" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Max Devices Per Student</label>
              <input type="number" defaultValue="1" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div className="flex items-center justify-between py-4 border-t border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Enable MAC Binding</h4>
                <p className="text-xs text-slate-500">Restrict attendance to registered devices only.</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-brand-500 right-0"/>
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-brand-500 cursor-pointer"></label>
              </div>
            </div>

            <div className="pt-4">
              <button type="button" onClick={() => alert('Settings saved successfully!')} className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
