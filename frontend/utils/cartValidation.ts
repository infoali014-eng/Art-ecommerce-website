import { CartItem, WishlistItem } from '@/types';

export function validateCartItems(data: unknown): CartItem[] {
  if (!Array.isArray(data)) {
    console.warn('Cart data loaded from local storage is not an array. Resetting.');
    return [];
  }
  return data.filter((item): item is CartItem => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Record<string, unknown>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.artworkId === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.price === 'number' &&
      typeof candidate.quantity === 'number' &&
      typeof candidate.image === 'string' &&
      typeof candidate.frameOption === 'string' &&
      typeof candidate.addedAt === 'string'
    );
  });
}

export function validateWishlistItems(data: unknown): WishlistItem[] {
  if (!Array.isArray(data)) {
    console.warn('Wishlist data loaded from local storage is not an array. Resetting.');
    return [];
  }
  return data.filter((item): item is WishlistItem => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Record<string, unknown>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.artworkId === 'string' &&
      typeof candidate.addedAt === 'string'
    );
  });
}
