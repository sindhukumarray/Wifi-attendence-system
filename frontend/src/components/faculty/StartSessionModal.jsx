import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';

const StartSessionModal = ({ isOpen, onClose, subjects, classrooms, onStart, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-scale-up">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Launch Session</h3>
              <p className="text-slate-500 font-medium">Configure your lecture details</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onStart)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Subject</label>
              <select 
                {...register('subject_id', { required: 'Subject is required' })}
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 transition-all appearance-none"
              >
                <option value="">Choose a subject...</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>
                ))}
              </select>
              {errors.subject_id && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.subject_id.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Classroom</label>
              <select 
                {...register('classroom_id', { required: 'Classroom is required' })}
                className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 font-bold text-slate-700 focus:ring-2 focus:ring-brand-500/20 transition-all appearance-none"
              >
                <option value="">Choose a room...</option>
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.room_name} - {c.wifi_ssid}</option>
                ))}
              </select>
              {errors.classroom_id && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.classroom_id.message}</p>}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                fullWidth 
                loading={loading}
                className="h-14 rounded-2xl text-base"
              >
                Activate Live Attendance
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartSessionModal;
