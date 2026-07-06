'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/admin/DashboardLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if unauthenticated
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      } else if (role !== 'admin') {
        // Redirect to 403 if authenticated but not an admin
        router.push('/403');
      }
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-[1.5px] border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
        <span className="text-[10px] uppercase tracking-widest text-secondary font-light">
          Verifying curation credentials...
        </span>
      </div>
    );
  }

  // Double check credentials before rendering admin workspace
  if (!user || role !== 'admin') {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
