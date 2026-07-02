import artistsData from '@/data/artists.json';
import artworksData from '@/data/artworks.json';
import categoriesData from '@/data/categories.json';
import collectionsData from '@/data/collections.json';

import { Artist, Artwork, Category, Collection } from '@/types';

const artworks = artworksData as Artwork[];
const artists = artistsData as Artist[];
const categories = categoriesData as Category[];
const collections = collectionsData as Collection[];

export const ArtworkService = {
  getAllArtworks(): Artwork[] {
    return artworks;
  },

  getArtworkBySlug(slug: string): Artwork | undefined {
    return artworks.find((art) => art.slug === slug);
  },

  getFeaturedArtworks(): Artwork[] {
    return artworks.filter((art) => art.featured);
  },

  getRelatedArtworks(slug: string, limit: number = 4): Artwork[] {
    const artwork = this.getArtworkBySlug(slug);
    if (!artwork) return [];
    return artworks
      .filter(
        (art) =>
          art.id !== artwork.id &&
          (art.category === artwork.category || art.collection === artwork.collection)
      )
      .slice(0, limit);
  },

  getArtists(): Artist[] {
    return artists;
  },

  getArtistById(id: string): Artist | undefined {
    return artists.find((artist) => artist.id === id);
  },

  getCategories(): Category[] {
    return categories;
  },

  getCollections(): Collection[] {
    return collections;
  },
};
