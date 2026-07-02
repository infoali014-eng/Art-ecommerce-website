/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client';

import { mapDbArtworkToUi } from './artwork.repository';

import { CartItem } from '@/types';

const supabase = createClient();

export function mapDbCartItemToUi(dbCartItem: any): CartItem {
  const artwork = dbCartItem.artworks;
  const uiArtwork = mapDbArtworkToUi(artwork);

  return {
    id: dbCartItem.id,
    artworkId: dbCartItem.artwork_id,
    title: uiArtwork.title,
    price: uiArtwork.price,
    quantity: dbCartItem.quantity,
    image: uiArtwork.images[0],
    frameOption: dbCartItem.frame_option,
    notes: '',
    addedAt: dbCartItem.created_at,
  };
}

export const CartRepository = {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, artworks(*, artists(name), artwork_images(image_url))')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(mapDbCartItemToUi);
  },

  async saveCartItems(userId: string, items: CartItem[]): Promise<void> {
    // Delete all current items
    const { error: deleteError } = await (supabase as any)
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;
    if (items.length === 0) return;

    // Batch insert new ones
    const dbInserts = items.map((item) => ({
      user_id: userId,
      artwork_id: item.artworkId,
      quantity: item.quantity,
      frame_option: item.frameOption,
    }));

    const { error: insertError } = await (supabase as any).from('cart_items').insert(dbInserts);
    if (insertError) throw insertError;
  },

  async mergeCartItems(userId: string, localItems: CartItem[]): Promise<void> {
    if (localItems.length === 0) return;

    // 1. Get database cart
    const dbItems = await this.getCartItems(userId);

    // 2. Construct map for merging
    const mergedMap = new Map<string, CartItem>();

    // Add database items first
    dbItems.forEach((item) => {
      const key = `${item.artworkId}_${item.frameOption}`;
      mergedMap.set(key, item);
    });

    // Merge guest items on top
    localItems.forEach((local) => {
      const key = `${local.artworkId}_${local.frameOption}`;
      const existing = mergedMap.get(key);

      if (existing) {
        mergedMap.set(key, {
          ...existing,
          quantity: existing.quantity + local.quantity,
        });
      } else {
        mergedMap.set(key, local);
      }
    });

    const combinedList = Array.from(mergedMap.values());

    // 3. Save combined list
    await this.saveCartItems(userId, combinedList);
  },
};
export default CartRepository;
