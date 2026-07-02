/* eslint-disable @typescript-eslint/no-explicit-any */
import collectionsData from '@/data/collections.json';
import { createClient } from '@/lib/supabase/client';
import { StorageService } from '@/services/storage.service';

import { Collection } from '@/types';

const supabase = createClient();
const localCollections = collectionsData as Collection[];

export function mapDbCollectionToUi(dbCol: any): Collection {
  const imageUrl = StorageService.getPublicUrl('artworks', dbCol.cover_image);

  return {
    id: dbCol.id,
    slug: dbCol.slug,
    name: dbCol.title,
    description: dbCol.description || '',
    image: imageUrl,
    curatorNote: 'Exclusively curated for Aura Art patrons.',
  };
}

export const CollectionRepository = {
  async getCollections(): Promise<Collection[]> {
    try {
      const { data, error } = await supabase.from('collections').select('*').is('deleted_at', null);
      if (error) throw error;
      return (data || []).map(mapDbCollectionToUi);
    } catch (e) {
      console.warn('[CollectionRepository] getCollections failed, falling back to mock JSON:', e);
      return localCollections;
    }
  },

  // Future Admin Operations
  async createCollection(collection: any) {
    const { data, error } = await (supabase as any)
      .from('collections')
      .insert(collection)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCollection(id: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCollection(id: string) {
    const { error } = await (supabase as any)
      .from('collections')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
export default CollectionRepository;
