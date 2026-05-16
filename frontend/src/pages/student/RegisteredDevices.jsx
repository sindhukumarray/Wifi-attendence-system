import React, { useEffect, useState } from 'react';
import useStudent from '../../hooks/useStudent';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import SkeletonLoader from '../../components/student/SkeletonLoader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  device_name: yup.string().required('Device name is required').max(50),
  mac_address: yup.string()
    .required('MAC address is required')
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC format (XX:XX:XX:XX:XX:XX)')
});

const RegisteredDevices = () => {
  const { loading, devices, fetchDevices, registerDevice, deleteDevice } = useStudent();
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const onSubmit = async (data) => {
    const success = await registerDevice(data);
    if (success) {
      setShowModal(false);
      reset();
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Registered Devices</h2>
            <p className="text-slate-500 font-medium mt-1">Manage hardware allowed for Wi-Fi attendance</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="rounded-2xl px-6 py-3 shadow-lg shadow-brand-600/20">
            Register New Device
          </Button>
        </div>

        {loading && !devices.length ? (
          <SkeletonLoader type="card" count={2} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.length > 0 ? (
              devices.map((device) => (
                <div key={device.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <button 
                      onClick={() => deleteDevice(device.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{device.device_name}</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">MAC: <span className="text-brand-600">{device.mac_address}</span></p>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Added {new Date(device.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-slate-50 rounded-full opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                <p className="text-slate-400 font-bold text-lg italic">No hardware devices registered. Add your phone or laptop to start tracking attendance!</p>
              </div>
            )}
          </div>
        )}

        {/* Register Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Register Device</h3>
              <p className="text-slate-500 font-medium mb-8">Bind your device MAC address to your account.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input 
                  label="Device Name (e.g., iPhone 15 Pro)"
                  {...register('device_name')}
                  error={errors.device_name?.message}
                  placeholder="My Smartphone"
                />
                <Input 
                  label="MAC Address (XX:XX:XX:XX:XX:XX)"
                  {...register('mac_address')}
                  error={errors.mac_address?.message}
                  placeholder="00:1A:2B:3C:4D:5E"
                />
                <Button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-2xl shadow-lg shadow-brand-600/20">
                  {isSubmitting ? 'Registering...' : 'Register Device'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegisteredDevices;
