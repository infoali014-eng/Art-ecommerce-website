/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/client';

import { WishlistItem } from '@/types';

const supabase = createClient();

export function mapDbWishlistItemToUi(dbItem: any): WishlistItem {
  return {
    id: dbItem.artwork_id,
    artworkId: dbItem.artwork_id,
    addedAt: dbItem.created_at,
  };
}

export const WishlistRepository = {
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await supabase.from('wishlist_items').select('*').eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(mapDbWishlistItemToUi);
  },

  async saveWishlistItems(userId: string, items: WishlistItem[]): Promise<void> {
    const { error: deleteError } = await (supabase as any)
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;
    if (items.length === 0) return;

    const dbInserts = items.map((item) => ({
      user_id: userId,
      artwork_id: item.artworkId,
    }));

    const { error: insertError } = await (supabase as any).from('wishlist_items').insert(dbInserts);
    if (insertError) throw insertError;
  },

  async mergeWishlistItems(userId: string, localItems: WishlistItem[]): Promise<void> {
    if (localItems.length === 0) return;

    const dbItems = await this.getWishlistItems(userId);
    const mergedMap = new Map<string, WishlistItem>();

    dbItems.forEach((item) => mergedMap.set(item.artworkId, item));
    localItems.forEach((local) => {
      if (!mergedMap.has(local.artworkId)) {
        mergedMap.set(local.artworkId, local);
      }
    });

    const combinedList = Array.from(mergedMap.values());
    await this.saveWishlistItems(userId, combinedList);
  },
};
export default WishlistRepository;
