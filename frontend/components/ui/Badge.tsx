import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 text-[10px] font-sans uppercase tracking-wider font-medium';
  
  const variants = {
    primary: 'bg-primary text-background',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-primary',
    outline: 'border border-primary/20 text-primary bg-transparent',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
