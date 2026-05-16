import React, { useEffect, useState } from 'react';

const LiveCounter = ({ count, label = "Total Present" }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div 
        className={`text-4xl font-black text-blue-600 transition-transform duration-300 ${animate ? 'scale-125 text-blue-500' : 'scale-100'}`}
      >
        {count}
      </div>
      <p className="text-slate-500 text-sm font-semibold mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
};

export default LiveCounter;
