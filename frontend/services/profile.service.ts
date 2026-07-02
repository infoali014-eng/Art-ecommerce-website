import { ProfileRepository } from '@/repositories/profile.repository';

import { StorageService } from './storage.service';

import { UserProfile } from '@/types';

export const ProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    return await ProfileRepository.getProfile(userId);
  },

  async updateProfile(userId: string, fullName: string, avatarUrl: string): Promise<UserProfile> {
    return await ProfileRepository.updateProfile(userId, { fullName, avatarUrl });
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const extension = file.name.split('.').pop() || 'png';
    const filePath = `${userId}/avatar-${Date.now()}.${extension}`;

    const path = await StorageService.uploadFile('avatars', filePath, file);
    const publicUrl = StorageService.getPublicUrl('avatars', path);

    // Sync profile table with the new avatar url
    await ProfileRepository.updateProfile(userId, { avatarUrl: publicUrl });

    return publicUrl;
  },
};
export default ProfileService;
