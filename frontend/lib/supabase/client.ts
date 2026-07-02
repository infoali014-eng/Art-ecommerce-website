import { createBrowserClient } from '@supabase/ssr';

import { Database } from '@/types/database';

export const createClient = () => {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://placeholder-aura-art.supabase.co';
  }
  if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
    supabaseAnonKey = 'placeholder-anon-key';
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};
export default createClient;
