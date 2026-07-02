import { Artwork } from '@/types';

export interface FilterParams {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  medium?: string;
  orientation?: string;
  availability?: string;
  featured?: boolean;
  newArrival?: boolean;
  popular?: boolean;
}

export function filterArtworks(artworks: Artwork[], filters: FilterParams): Artwork[] {
  return artworks.filter((art) => {
    if (filters.category && filters.category !== 'all' && art.category !== filters.category) {
      return false;
    }
    if (filters.priceMin !== undefined && art.price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax !== undefined && art.price > filters.priceMax) {
      return false;
    }
    if (
      filters.medium &&
      filters.medium !== 'all' &&
      !art.medium.toLowerCase().includes(filters.medium.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.orientation &&
      filters.orientation !== 'all' &&
      art.orientation !== filters.orientation
    ) {
      return false;
    }
    if (
      filters.availability &&
      filters.availability !== 'all' &&
      art.availability !== filters.availability
    ) {
      return false;
    }
    if (filters.featured !== undefined && filters.featured && !art.featured) {
      return false;
    }
    if (filters.newArrival !== undefined && filters.newArrival && !art.newArrival) {
      return false;
    }
    if (filters.popular !== undefined && filters.popular && !art.popular) {
      return false;
    }
    return true;
  });
}
export default filterArtworks;
