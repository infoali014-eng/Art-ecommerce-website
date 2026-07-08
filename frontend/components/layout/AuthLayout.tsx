'use client';

import React from 'react';

import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white border border-primary/5 p-8 md:p-10 shadow-xl">
        <div className="text-center">
          <Link
            href="/"
            className="font-cormorant text-3xl font-light text-primary tracking-widest uppercase hover:text-accent transition-colors"
          >
            Manan Art Gallery
          </Link>
          <h2 className="mt-6 font-cormorant text-2xl font-light text-primary tracking-wide">
            {title}
          </h2>
          <p className="mt-2 text-xs text-secondary font-light">{subtitle}</p>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </div>
        {children}
      </div>
    </div>
  );
};
export default AuthLayout;
