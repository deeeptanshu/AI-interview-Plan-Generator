import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth = false, className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-bold rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-gradient-to-b from-green-500 to-green-600 text-white border-green-600 hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/20 focus:ring-green-500',
    secondary: 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:border-slate-600 focus:ring-blue-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};