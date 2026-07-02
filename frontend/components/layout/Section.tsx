import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-8 md:py-12',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32',
    xl: 'py-32 md:py-48',
  };

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </section>
  );
};
