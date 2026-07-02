'use client';

import React, { Suspense, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import AuthLayout from '@/components/layout/AuthLayout';
import LoadingButton from '@/components/ui/LoadingButton';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.login(email, password);
      addToast('Login successful. Welcome back to Aura Art!', 'success');
      router.push(redirectUrl);
    } catch (err) {
      setError(AuthService.mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Acquire fine art and manage your account">
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

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[9px] text-accent uppercase tracking-wider hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center text-xs text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 accent-accent"
            />
            Keep me signed in
          </label>
        </div>

        <div className="pt-2">
          <LoadingButton type="submit" variant="primary" fullWidth loading={loading}>
            Log In
          </LoadingButton>
        </div>

        <div className="text-center pt-4 border-t border-primary/5 text-xs text-secondary font-light">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent font-normal hover:underline">
            Create one
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-xs text-secondary font-sans">
          Loading page...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
