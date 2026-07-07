import artistsData from '@/data/artists.json';
import { createClient } from '@/lib/supabase/client';
import { StorageService } from '@/services/storage.service';

import { Artist } from '@/types';

const supabase = createClient();
const localArtists = artistsData as Artist[];

export function mapDbArtistToUi(dbArtist: any): Artist {
  const profileUrl = StorageService.getPublicUrl('artists', dbArtist.profile_image);

  return {
    id: dbArtist.id,
    slug: dbArtist.slug,
    name: dbArtist.name,
    bio: dbArtist.bio || '',
    avatar: profileUrl,
    mediums: [dbArtist.specialty || 'Mixed Media'],
    statement: 'In pursuit of fine art and silent presence.',
  };
}

export const ArtistRepository = {
  async getArtists(): Promise<Artist[]> {
    try {
      const { data, error } = await supabase.from('artists').select('*').is('deleted_at', null);
      if (error) throw error;
      return (data || []).map(mapDbArtistToUi);
    } catch (e) {
      console.warn('[ArtistRepository] getArtists failed, falling back to mock JSON:', e);
      return localArtists;
    }
  },

  async getArtistById(id: string): Promise<Artist | null> {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapDbArtistToUi(data);
    } catch (e) {
      console.warn('[ArtistRepository] getArtistById failed, falling back to mock JSON:', e);
      return localArtists.find((art) => art.id === id) || null;
    }
  },

  // Future Admin Operations
  async createArtist(artist: any) {
    const { data, error } = await (supabase as any)
      .from('artists')
      .insert(artist)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateArtist(id: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('artists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteArtist(id: string) {
    const { error } = await (supabase as any)
      .from('artists')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
export default ArtistRepository;
