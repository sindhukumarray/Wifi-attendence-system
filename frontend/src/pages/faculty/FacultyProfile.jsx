import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useFaculty from '../../hooks/useFaculty';
import DashboardLayout from '../../layouts/DashboardLayout';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from 'react-hook-form';
import FacultySkeleton from '../../components/faculty/FacultySkeleton';

const FacultyProfile = () => {
  const { user } = useAuth();
  const { loading, updateProfile } = useFaculty();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  return (
    <DashboardLayout sidebar={<Sidebar />} navbar={<Navbar />}>
      <div className="space-y-10 animate-fade-in max-w-4xl">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Profile</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your teacher credentials and academic data</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleSubmit(updateProfile)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  label="Full Name" 
                  {...register('name')}
                  placeholder="Enter your name"
                />
                <Input 
                  label="Email Address" 
                  {...register('email')}
                  placeholder="Enter your email"
                />
              </div>

              <div className="pt-6 border-t border-slate-50">
                <Button type="submit" loading={loading} className="px-10">
                  Update Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyProfile;
