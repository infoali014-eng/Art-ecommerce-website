import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const AuthService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async register(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo:
          typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
      },
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
    return data;
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  mapAuthError(error: unknown): string {
    if (!error) return 'An unexpected error occurred. Please try again.';

    let message = '';
    let status: number | undefined;

    if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; status?: number };
      message = err.message || '';
      status = err.status;
    }

    // Handle standard network error
    if (message.toLowerCase().includes('fetch') || message.toLowerCase().includes('network')) {
      return 'Unable to connect. Please check your internet connection and try again.';
    }

    if (message.includes('Invalid login credentials')) {
      return 'Incorrect email or password. Please verify your credentials and try again.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Your email address has not been verified yet. Please check your inbox for the confirmation link.';
    }
    if (message.includes('User already registered') || message.includes('already exists')) {
      return 'An account with this email address already exists. Try logging in instead.';
    }
    if (message.includes('Password should be')) {
      return 'Password must be at least 8 characters long.';
    }
    if (
      status === 429 ||
      message.toLowerCase().includes('rate limit') ||
      message.toLowerCase().includes('too many requests')
    ) {
      return 'Too many login attempts. Please wait a few minutes before trying again.';
    }

    return message || 'An authentication error occurred. Please try again.';
  },
};

export default AuthService;
