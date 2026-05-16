import React from 'react';

const Badge = ({ children, variant = 'neutral' }) => {
  const variants = {
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    primary: 'bg-blue-100 text-blue-700',
    neutral: 'bg-slate-100 text-slate-700'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
