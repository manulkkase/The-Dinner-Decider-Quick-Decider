import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SecondaryButton: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  const baseClasses = "w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed";
  
  return (
    <button
      className={`${baseClasses} ${className || ''}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};