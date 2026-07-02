import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full font-sans">
        {label && (
          <label className="block text-[10px] uppercase tracking-wider text-secondary mb-1.5 font-medium">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full bg-white border border-primary/10 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors duration-300 ${
            error ? 'border-red-500 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="block text-[10px] text-red-500 mt-1 uppercase tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
