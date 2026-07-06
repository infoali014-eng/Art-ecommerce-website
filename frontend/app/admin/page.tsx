'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-sans">
      <div className="w-10 h-10 border-[1.5px] border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );
}
