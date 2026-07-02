import { useWishlist } from '@/hooks/useWishlist';

export function useFavorites() {
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();

  return {
    favorites: wishlist.map((item) => item.artworkId),
    toggleFavorite: (id: string) => toggleWishlist(id),
    isFavorite: isWishlisted,
  };
}
export default useFavorites;
