import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-500",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700 focus:ring-blue-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500",
    ghost: "text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
