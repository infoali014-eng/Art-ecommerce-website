import { STORAGE_KEYS } from '@/constants/storage';
import { validateCartItems } from '@/utils/cartValidation';

import { CartItem } from '@/types';

export const CartService = {
  getCartItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return validateCartItems(parsed);
    } catch (e) {
      console.error('Failed to retrieve cart items, resetting storage:', e);
      this.saveCartItems([]);
      return [];
    }
  },

  saveCartItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart items:', e);
    }
  },
};
export default CartService;
