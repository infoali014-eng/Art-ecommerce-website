'use client';

import React from 'react';

import Link from 'next/link';

import { ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-primary/5 p-10 text-center shadow-xl rounded-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 stroke-[1.2]" />
        </div>
        <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-2">
          ACCESS FORBIDDEN
        </span>
        <h1 className="font-cormorant text-3xl font-light text-primary tracking-wide mb-4">
          Unauthorised Credentials
        </h1>
        <p className="text-secondary/70 text-xs font-light mb-8 leading-relaxed">
          You do not have administrative permissions to access the Admin Control Center. If you
          believe this is in error, please contact curation support.
        </p>
        <div className="flex flex-col space-y-2">
          <Link href="/">
            <Button variant="primary" fullWidth size="sm">
              Return to Gallery
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" fullWidth size="sm">
              Sign In as Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
