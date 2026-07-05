/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client';

import { UserProfile } from '@/types';

const supabase = createClient();

export function mapDbProfileToUi(dbProfile: any): UserProfile {
  return {
    id: dbProfile.id,
    fullName: dbProfile.full_name || '',
    avatarUrl: dbProfile.avatar_url || '',
    role: dbProfile.role || 'customer',
    adminRole: dbProfile.admin_role || undefined,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
    deletedAt: dbProfile.deleted_at || undefined,
  };
}

export const ProfileRepository = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return mapDbProfileToUi(data);
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const dbUpdates: any = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;

    const { data, error } = await (supabase as any)
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapDbProfileToUi(data);
  },
};
export default ProfileRepository;
