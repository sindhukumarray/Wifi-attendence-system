import React, { useEffect } from 'react';
import useStudent from '../../hooks/useStudent';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from '../../hooks/useAuth';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const StudentProfile = () => {
  const { user } = useAuth();
  const { updateProfile } = useStudent();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    await updateProfile(data);
  };

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-10 animate-fade-in max-w-4xl">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Profile</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your account and academic credentials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Identity Card */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-brand-50 to-brand-100 rounded-[2.5rem] flex items-center justify-center text-brand-700 font-black text-5xl border border-brand-200/50 shadow-sm mx-auto mb-6">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">{user?.name}</h3>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{user?.role}</p>
            
            <div className="mt-10 pt-10 border-t border-slate-50 text-left space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll Number</p>
                <p className="font-bold text-slate-800">{user?.roll_no}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                <p className="font-bold text-slate-800">{user?.department_name || 'Not Assigned'}</p>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Personal Information</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <Input 
                label="Full Name"
                {...register('name')}
                error={errors.name?.message}
              />
              <Input 
                label="Email Address"
                {...register('email')}
                error={errors.email?.message}
              />
              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="rounded-2xl px-10 py-4 shadow-lg shadow-brand-600/20">
                  {isSubmitting ? 'Saving Changes...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
