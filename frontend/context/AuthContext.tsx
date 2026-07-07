'use client';

import React, { createContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Session, User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const supabase = createClient() as any;
  const router = useRouter();
  const initializedRef = React.useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          if (initialSession.user.email === 'infoali014@gmail.com') {
            setRole('admin');
            // Auto-update profiles table in background
            supabase
              .from('profiles')
              .upsert({
                id: initialSession.user.id,
                full_name: 'Ali Shair',
                role: 'admin',
                admin_role: 'super_admin',
                updated_at: new Date().toISOString(),
              })
              .then(({ error }: { error: any }) => {
                if (error) console.error('Failed to seed default admin profile:', error);
              });
          } else {
            setRole(initialSession.user.user_metadata?.role || 'user');
          }
        }
      } catch (e) {
        console.error('Failed to initialize session:', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, currentSession: any) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user?.email === 'infoali014@gmail.com') {
        setRole('admin');
        // Auto-update profiles table in background
        supabase
          .from('profiles')
          .upsert({
            id: currentSession.user.id,
            full_name: 'Ali Shair',
            role: 'admin',
            admin_role: 'super_admin',
            updated_at: new Date().toISOString(),
          })
          .then(({ error }: { error: any }) => {
            if (error) console.error('Failed to seed default admin profile:', error);
          });
      } else {
        setRole(currentSession?.user?.user_metadata?.role || 'user');
      }
      setLoading(false);

      if (event === 'SIGNED_IN') {
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setRole(null);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
