'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthLayout from '@/components/layout/AuthLayout';
import LoadingButton from '@/components/ui/LoadingButton';
import PasswordStrength from '@/components/ui/PasswordStrength';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { addToast } = useToast();

  const validateForm = () => {
    if (!fullName.trim()) return 'Name is required.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return 'Password must contain both uppercase and lowercase letters.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await AuthService.register(email, password, fullName);
      addToast('Registration successful! Please verify your email.', 'success');
      router.push('/register/success');
    } catch (err) {
      setError(AuthService.mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Register to join our collector community">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-3 text-xs font-sans">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent"
          />
        </div>

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
          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent"
          />
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-background border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent"
          />
        </div>

        <div className="pt-2">
          <LoadingButton type="submit" variant="primary" fullWidth loading={loading}>
            Create Account
          </LoadingButton>
        </div>

        <div className="text-center pt-4 border-t border-primary/5 text-xs text-secondary font-light">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-normal hover:underline">
            Log In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
