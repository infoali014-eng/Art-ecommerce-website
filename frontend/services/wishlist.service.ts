import { STORAGE_KEYS } from '@/constants/storage';
import { validateWishlistItems } from '@/utils/cartValidation';

import { WishlistItem } from '@/types';

export const WishlistService = {
  getWishlistItems(): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return validateWishlistItems(parsed);
    } catch (e) {
      console.error('Failed to retrieve wishlist items, resetting storage:', e);
      this.saveWishlistItems([]);
      return [];
    }
  },

  saveWishlistItems(items: WishlistItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wishlist items:', e);
    }
  },
};
export default WishlistService;
