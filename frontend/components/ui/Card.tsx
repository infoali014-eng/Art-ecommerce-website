import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div
      className={`bg-white border border-primary/5 transition-all duration-500 overflow-hidden ${
        hoverable ? 'hover:-translate-y-1 hover:shadow-xl hover:border-accent/30' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
