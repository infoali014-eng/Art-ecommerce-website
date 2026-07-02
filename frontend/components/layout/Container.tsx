import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  clean?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  clean = false,
}) => {
  return (
    <div
      className={
        clean
          ? className
          : `mx-auto max-w-7xl px-6 lg:px-12 ${className}`
      }
    >
      {children}
    </div>
  );
};
