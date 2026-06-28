import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white border border-slate-200/80 rounded-xl shadow-xs p-6 
        transition-all duration-200 
        ${hoverable ? 'hover:shadow-md hover:border-slate-300/80 hover:-translate-y-[1px]' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 pb-4 border-b border-slate-100 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-slate-900 tracking-tight leading-none ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-500 mt-1 leading-normal ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`pt-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`flex items-center pt-4 border-t border-slate-100 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
