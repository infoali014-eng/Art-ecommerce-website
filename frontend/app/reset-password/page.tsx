'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import AuthLayout from '@/components/layout/AuthLayout';
import LoadingButton from '@/components/ui/LoadingButton';
import PasswordStrength from '@/components/ui/PasswordStrength';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { addToast } = useToast();

  const validateForm = () => {
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
      await AuthService.updatePassword(password);
      addToast('Password has been reset successfully! Please log in.', 'success');
      router.push('/login');
    } catch (err) {
      setError(AuthService.mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Update Password" subtitle="Configure a new secure password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-3 text-xs font-sans">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] text-secondary font-medium uppercase tracking-wider block">
            New Password
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
            Confirm New Password
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
            Update Password
          </LoadingButton>
        </div>
      </form>
    </AuthLayout>
  );
}
