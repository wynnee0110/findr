import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glass';
  fullWidth?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:pointer-events-none disabled:active:scale-100";
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3.5 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  const variants = {
    primary: "bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 hover:-translate-y-0.5 border border-white/10",
    secondary: "bg-white dark:bg-gray-800 text-brand-dark dark:text-white shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700",
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20",
    danger: "bg-brand-red text-white shadow-lg shadow-brand-red/30 hover:shadow-xl hover:shadow-brand-red/40 hover:-translate-y-0.5",
    ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800 hover:text-brand-dark dark:hover:text-white",
    glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};