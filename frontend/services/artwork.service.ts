import { ArtistRepository } from '@/repositories/artist.repository';
import { ArtworkRepository } from '@/repositories/artwork.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import { CollectionRepository } from '@/repositories/collection.repository';

import { Artist, Artwork, Category, Collection } from '@/types';

export const ArtworkService = {
  async getAllArtworks(): Promise<Artwork[]> {
    const { data } = await ArtworkRepository.getArtworks({ limit: 100 });
    return data;
  },

  async getArtworks(filters: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ data: Artwork[]; count: number }> {
    return await ArtworkRepository.getArtworks(filters);
  },

  async getArtworkBySlug(slug: string): Promise<Artwork | null> {
    return await ArtworkRepository.getArtworkBySlug(slug);
  },

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return await ArtworkRepository.getFeaturedArtworks();
  },

  async getRelatedArtworks(slug: string, limit = 4): Promise<Artwork[]> {
    return await ArtworkRepository.getRelatedArtworks(slug, limit);
  },

  // Legacy compatibility wrappers for artists, categories, and collections
  async getArtists(): Promise<Artist[]> {
    return await ArtistRepository.getArtists();
  },

  async getArtistById(id: string): Promise<Artist | null> {
    return await ArtistRepository.getArtistById(id);
  },

  async getCategories(): Promise<Category[]> {
    return await CategoryRepository.getCategories();
  },

  async getCollections(): Promise<Collection[]> {
    return await CollectionRepository.getCollections();
  },
};
export default ArtworkService;
