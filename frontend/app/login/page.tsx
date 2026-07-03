'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import AuthLayout from '@/components/layout/AuthLayout';
import LoadingButton from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(0);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/';

  // Mount logic: Check for existing session and rate limits
  useEffect(() => {
    if (!authLoading && user) {
      addToast('You are already authenticated.', 'info');
      router.push(redirectUrl);
    }
  }, [user, authLoading, router, redirectUrl, addToast]);

  useEffect(() => {
    const savedExpiry = localStorage.getItem('auth_rate_limit_until');
    if (savedExpiry) {
      const remaining = Math.ceil((Number(savedExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldownTimeLeft(remaining);
      } else {
        localStorage.removeItem('auth_rate_limit_until');
      }
    }
  }, []);

  // Cooldown countdown interval
  useEffect(() => {
    if (cooldownTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setCooldownTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('auth_rate_limit_until');
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownTimeLeft]);

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || cooldownTimeLeft > 0) return;

    if (!email.trim()) {
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      passwordRef.current?.focus();
      return;
    }

    setError('');
    setLoading(true);

    try {
      await AuthService.login(email, password);
      addToast('Login successful. Welcome back to Aura Art!', 'success');
      router.push(redirectUrl);
    } catch (err) {
      const mappedMsg = AuthService.mapAuthError(err);
      setError(mappedMsg);

      // Trigger cooldown if rate limit hit
      if (mappedMsg.includes('Too many login attempts')) {
        addToast(mappedMsg, 'error');
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
        localStorage.setItem('auth_rate_limit_until', String(expiry));
        setCooldownTimeLeft(300);
      } else {
        passwordRef.current?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  // Dev tools actions
  const handleClearSession = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('supabase.auth.token');
      addToast('Session cleared locally.', 'info');
      window.location.reload();
    } catch (e) {
      console.error(e);
      addToast('Failed to clear session.', 'error');
    }
  };

  const handleClearAuthCache = () => {
    localStorage.removeItem('auth_rate_limit_until');
    setCooldownTimeLeft(0);
    addToast('Auth cache & rate limits cleared.', 'info');
  };

  const handleResetDraft = () => {
    localStorage.removeItem('aura_commission_draft');
    localStorage.removeItem('aura_commission_step');
    localStorage.removeItem('aura_commission_images');
    addToast('Bespoke draft reset.', 'info');
  };

  const isFormDisabled = loading || cooldownTimeLeft > 0 || authLoading;

  return (
    <AuthLayout title="Welcome Back" subtitle="Acquire fine art and manage your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-3 text-xs font-sans">
            {error}
          </div>
        )}

        {cooldownTimeLeft > 0 && (
          <div className="bg-amber-50 text-amber-800 border border-amber-100 p-3 text-xs font-sans flex justify-between items-center">
            <span>Too many login attempts. Please wait:</span>
            <span className="font-semibold">{formatCooldown(cooldownTimeLeft)}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
            Email Address
          </label>
          <input
            type="email"
            required
            ref={emailRef}
            disabled={isFormDisabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent disabled:opacity-50"
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
            ref={passwordRef}
            disabled={isFormDisabled}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center text-xs text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              disabled={isFormDisabled}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 accent-accent"
            />
            Keep me signed in
          </label>
        </div>

        <div className="pt-2">
          <LoadingButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={isFormDisabled}
          >
            {cooldownTimeLeft > 0 ? `Wait ${formatCooldown(cooldownTimeLeft)}` : 'Log In'}
          </LoadingButton>
        </div>

        <div className="text-center pt-4 border-t border-primary/5 text-xs text-secondary font-light">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent font-normal hover:underline">
            Create one
          </Link>
        </div>
      </form>

      {/* Development tools section */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 border border-accent/20 bg-accent/5 p-4 text-xs font-sans space-y-3">
          <div className="font-semibold text-primary uppercase tracking-wider text-[10px]">
            Development Utilities
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleClearSession}
              className="px-2.5 py-1 border border-primary/10 bg-white hover:border-accent/40 text-secondary transition-colors duration-200 text-[10px] uppercase font-medium tracking-wide"
            >
              Clear Session
            </button>
            <button
              type="button"
              onClick={handleClearAuthCache}
              className="px-2.5 py-1 border border-primary/10 bg-white hover:border-accent/40 text-secondary transition-colors duration-200 text-[10px] uppercase font-medium tracking-wide"
            >
              Clear Auth Cache
            </button>
            <button
              type="button"
              onClick={handleResetDraft}
              className="px-2.5 py-1 border border-primary/10 bg-white hover:border-accent/40 text-secondary transition-colors duration-200 text-[10px] uppercase font-medium tracking-wide"
            >
              Reset Draft
            </button>
          </div>
        </div>
      )}
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
