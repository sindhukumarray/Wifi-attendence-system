import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ease-out shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30 hover:shadow-lg",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 hover:shadow-md",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/30 hover:shadow-lg",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
