'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import LoadingButton from '@/components/ui/LoadingButton';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await AuthService.resetPassword(email);
      setSuccess(true);
      addToast('Password reset link sent to your email!', 'success');
    } catch (err) {
      setError(AuthService.mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="We will email you a link to reset your account password"
    >
      {success ? (
        <div className="space-y-4 text-center">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-4 text-xs font-sans">
            We have sent a password reset link to your email address. Please click the link to
            configure a new password.
          </div>
          <Link href="/login" className="block w-full">
            <LoadingButton variant="primary" fullWidth loading={false}>
              Return to Login
            </LoadingButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 p-3 text-xs font-sans">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-2">
            <LoadingButton type="submit" variant="primary" fullWidth loading={loading}>
              Send Recovery Link
            </LoadingButton>
          </div>

          <div className="text-center pt-4 border-t border-primary/5">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
