import React from 'react';

const FacultySkeleton = ({ type = 'dashboard' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-[2rem]"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[400px] bg-slate-100 rounded-[2.5rem]"></div>
          <div className="h-[400px] bg-slate-100 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-xl"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-slate-50 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return null;
};

export default FacultySkeleton;
