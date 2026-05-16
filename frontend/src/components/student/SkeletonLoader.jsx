import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array(count).fill(0);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
              <div className="w-12 h-6 bg-slate-50 rounded-lg"></div>
            </div>
            <div className="w-24 h-4 bg-slate-100 rounded-full mb-3"></div>
            <div className="w-16 h-8 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="p-6 border-b border-slate-50">
          <div className="w-32 h-6 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="p-6 space-y-4">
          {skeletons.map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-1 h-10 bg-slate-100 rounded-xl"></div>
              <div className="flex-1 h-10 bg-slate-50 rounded-xl"></div>
              <div className="flex-1 h-10 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
