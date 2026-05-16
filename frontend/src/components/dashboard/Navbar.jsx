import React from 'react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="nav-blur px-6 py-4 flex justify-between items-center sticky top-0 border-b border-slate-200/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
        <span className="w-2 h-8 bg-brand-600 rounded-full hidden sm:block"></span>
        {user?.role === 'admin' ? 'Administration' : user?.role === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
      </h1>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="text-sm text-right hidden sm:block">
            <p className="font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role || 'Guest'}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl flex items-center justify-center text-brand-700 font-black border border-brand-200/50 shadow-sm transform group-hover:rotate-3 transition-transform">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
