import { useWishlist } from '@/context/WishlistContext';

export function useFavorites() {
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  return {
    favorites: wishlist,
    toggleFavorite: toggleWishlist,
    isFavorite: isWishlisted,
  };
}
export default useFavorites;
