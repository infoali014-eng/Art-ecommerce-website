import { STORAGE_KEYS } from '@/constants/storage';
import { WishlistRepository } from '@/repositories/wishlist.repository';
import { validateWishlistItems } from '@/utils/cartValidation';

import { WishlistItem } from '@/types';

export const WishlistService = {
  async getWishlistItems(userId?: string): Promise<WishlistItem[]> {
    if (userId) {
      try {
        return await WishlistRepository.getWishlistItems(userId);
      } catch (e) {
        console.error('[WishlistService] Error fetching user wishlist from Supabase:', e);
      }
    }

    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!stored) return [];
      return validateWishlistItems(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse guest wishlist:', e);
      return [];
    }
  },

  async saveWishlistItems(items: WishlistItem[], userId?: string): Promise<void> {
    if (userId) {
      try {
        await WishlistRepository.saveWishlistItems(userId, items);
        return;
      } catch (e) {
        console.error('[WishlistService] Error saving user wishlist to Supabase:', e);
      }
    }

    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save guest wishlist:', e);
    }
  },

  async mergeGuestWishlist(localItems: WishlistItem[], userId: string): Promise<void> {
    try {
      await WishlistRepository.mergeWishlistItems(userId, localItems);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.WISHLIST);
      }
    } catch (e) {
      console.error('[WishlistService] Error merging guest wishlist:', e);
    }
  },
};
export default WishlistService;
