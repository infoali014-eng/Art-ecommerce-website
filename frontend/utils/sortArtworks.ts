import { Artwork } from '@/types';

export type SortOption =
  'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'alphabetical' | 'popularity';

export function sortArtworks(artworks: Artwork[], option: SortOption): Artwork[] {
  const sorted = [...artworks];

  switch (option) {
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.year || 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.year || 0;
        return dateB - dateA;
      });
    case 'oldest':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.year || 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.year || 0;
        return dateA - dateB;
      });
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'popularity':
      return sorted.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return b.price - a.price;
      });
    default:
      return sorted;
  }
}
export default sortArtworks;
