import React from 'react';

const Badge = ({ 
  children, 
  variant = 'slate', 
  pulse = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-colors";
  
  const variants = {
    blue: "bg-blue-50 text-blue-700 border-blue-200/60",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    sky: "bg-sky-50 text-sky-700 border-sky-200/60",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200/60",
    red: "bg-red-50 text-red-700 border-red-200/60",
    slate: "bg-slate-50 text-slate-700 border-slate-200/60"
  };

  const pulseColors = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    slate: "bg-slate-500"
  };

  return (
    <span 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[variant]}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColors[variant]}`}></span>
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
