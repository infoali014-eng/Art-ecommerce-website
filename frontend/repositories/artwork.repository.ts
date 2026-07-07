import artworksData from '@/data/artworks.json';
import { createClient } from '@/lib/supabase/client';
import { StorageService } from '@/services/storage.service';

import { Artwork } from '@/types';

const supabase = createClient();
const localArtworks = artworksData as Artwork[];

export function mapDbArtworkToUi(dbArt: any): Artwork {
  const artistName = dbArt.artists?.name || 'Unknown Artist';
  const imageUrls = (dbArt.artwork_images || []).map((img: any) =>
    StorageService.getPublicUrl('artworks', img.image_url)
  );

  return {
    id: dbArt.id,
    slug: dbArt.slug,
    title: dbArt.title,
    artist: artistName,
    artistId: dbArt.artist_id || '',
    description: dbArt.description || '',
    story: dbArt.story || '',
    technique: dbArt.technique || '',
    price: Number(dbArt.price),
    category: dbArt.category_id as 'paintings' | 'calligraphy' | 'sketches',
    medium: dbArt.medium || '',
    dimensions: dbArt.dimensions || '',
    orientation: dbArt.orientation as 'portrait' | 'landscape' | 'square',
    availability: dbArt.availability as 'available' | 'sold' | 'reserved',
    featured: dbArt.featured,
    popular: dbArt.popular,
    newArrival: dbArt.new_arrival,
    isOriginal: dbArt.is_original,
    framingAvailable: dbArt.framing_available,
    estimatedDelivery: dbArt.estimated_delivery || '5–7 Days',
    tags: [],
    images: imageUrls,
    collection: dbArt.collection_id || undefined,
    year: new Date(dbArt.created_at).getFullYear(),
    createdAt: dbArt.created_at,
  };
}

export const ArtworkRepository = {
  async getArtworks(
    filters: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    } = {}
  ): Promise<{ data: Artwork[]; count: number }> {
    const { page = 1, limit = 12, category, search } = filters;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    try {
      let query = supabase
        .from('artworks')
        .select('*, artists(name), artwork_images(image_url)', { count: 'exact' })
        .is('deleted_at', null)
        .eq('is_active', true);

      if (category) {
        query = query.eq('category_id', category);
      }

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      return {
        data: (data || []).map(mapDbArtworkToUi),
        count: count || 0,
      };
    } catch (e) {
      console.warn('[ArtworkRepository] DB query failed, falling back to mock JSON:', e);
      let filtered = [...localArtworks];
      if (category && category !== 'all') {
        filtered = filtered.filter((art) => art.category === category);
      }
      if (search) {
        filtered = filtered.filter((art) => art.title.toLowerCase().includes(search.toLowerCase()));
      }
      const paginated = filtered.slice(start, start + limit);
      return {
        data: paginated,
        count: filtered.length,
      };
    }
  },

  async getArtworkBySlug(slug: string): Promise<Artwork | null> {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*, artists(name), artwork_images(image_url)')
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapDbArtworkToUi(data);
    } catch (e) {
      console.warn('[ArtworkRepository] getArtworkBySlug failed, falling back to mock JSON:', e);
      return localArtworks.find((art) => art.slug === slug) || null;
    }
  },

  async getFeaturedArtworks(): Promise<Artwork[]> {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*, artists(name), artwork_images(image_url)')
        .eq('featured', true)
        .is('deleted_at', null)
        .eq('is_active', true);

      if (error) throw error;
      return (data || []).map(mapDbArtworkToUi);
    } catch (e) {
      console.warn('[ArtworkRepository] getFeaturedArtworks failed, falling back to mock JSON:', e);
      return localArtworks.filter((art) => art.featured);
    }
  },

  async getRelatedArtworks(slug: string, limit = 4): Promise<Artwork[]> {
    try {
      const artwork = await this.getArtworkBySlug(slug);
      if (!artwork) return [];

      let query = supabase
        .from('artworks')
        .select('*, artists(name), artwork_images(image_url)')
        .is('deleted_at', null)
        .eq('is_active', true)
        .neq('id', artwork.id);

      if (artwork.collection) {
        query = query.or(
          `category_id.eq.${artwork.category},collection_id.eq.${artwork.collection}`
        );
      } else {
        query = query.eq('category_id', artwork.category);
      }

      const { data, error } = await query.limit(limit);
      if (error) throw error;

      return (data || []).map(mapDbArtworkToUi);
    } catch (e) {
      console.warn('[ArtworkRepository] getRelatedArtworks failed, falling back to mock JSON:', e);
      const artwork = localArtworks.find((art) => art.slug === slug);
      if (!artwork) return [];
      return localArtworks
        .filter(
          (art) =>
            art.id !== artwork.id &&
            (art.category === artwork.category || art.collection === artwork.collection)
        )
        .slice(0, limit);
    }
  },

  // Future Admin Operations
  async createArtwork(artwork: any) {
    const { data, error } = await (supabase as any)
      .from('artworks')
      .insert(artwork)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateArtwork(id: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('artworks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteArtwork(id: string) {
    const { error } = await (supabase as any)
      .from('artworks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
export default ArtworkRepository;
