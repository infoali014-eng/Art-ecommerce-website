import { STORAGE_KEYS } from '@/constants/storage';
import { CartRepository } from '@/repositories/cart.repository';
import { validateCartItems } from '@/utils/cartValidation';

import { CartItem } from '@/types';

export const CartService = {
  async getCartItems(userId?: string): Promise<CartItem[]> {
    if (userId) {
      try {
        return await CartRepository.getCartItems(userId);
      } catch (e) {
        console.error('[CartService] Error fetching user cart from Supabase:', e);
      }
    }

    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (!stored) return [];
      return validateCartItems(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse guest cart:', e);
      return [];
    }
  },

  async saveCartItems(items: CartItem[], userId?: string): Promise<void> {
    if (userId) {
      try {
        await CartRepository.saveCartItems(userId, items);
        return;
      } catch (e) {
        console.error('[CartService] Error saving user cart to Supabase:', e);
      }
    }

    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save guest cart:', e);
    }
  },

  async mergeGuestCart(localItems: CartItem[], userId: string): Promise<void> {
    try {
      await CartRepository.mergeCartItems(userId, localItems);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.CART);
      }
    } catch (e) {
      console.error('[CartService] Error merging guest cart:', e);
    }
  },
};
export default CartService;
