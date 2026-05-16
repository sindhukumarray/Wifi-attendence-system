import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
        }`}
        {...props}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
});

export default Input;
