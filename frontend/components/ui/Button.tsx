import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans text-xs uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer';
  
  const variants = {
    primary: 'bg-primary text-background hover:bg-accent hover:text-primary',
    secondary: 'bg-accent text-primary hover:bg-primary hover:text-background',
    outline: 'border border-primary text-primary bg-transparent hover:bg-primary hover:text-background',
    ghost: 'text-primary bg-transparent hover:bg-primary/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
