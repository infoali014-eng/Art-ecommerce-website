'use client';

import React from 'react';

import Link from 'next/link';

import { ArrowRight, Mail } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';

export default function RegisterSuccessPage() {
  return (
    <AuthLayout title="Verification Email Sent" subtitle="One last step to confirm your account">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          <Mail className="w-8 h-8 stroke-[1.2]" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-primary font-medium">Please check your inbox</p>
          <p className="text-xs text-secondary font-light max-w-xs leading-relaxed">
            We have sent a verification link to your registered email address. Click the link to
            activate your profile and access the gallery.
          </p>
        </div>
        <div className="w-full pt-4 space-y-3">
          <Link href="/login" className="block w-full">
            <Button
              variant="primary"
              fullWidth
              className="inline-flex items-center justify-center gap-2"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="block w-full">
            <Button variant="outline" fullWidth>
              Return to Gallery
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
