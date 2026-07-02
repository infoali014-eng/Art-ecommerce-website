export const AnalyticsService = {
  trackAddToCart(artworkId: string, title: string, price: number, frameOption: string) {
    console.log('[Analytics] Add to Cart:', { artworkId, title, price, frameOption });
  },
  trackRemoveFromCart(itemId: string, title: string) {
    console.log('[Analytics] Remove from Cart:', { itemId, title });
  },
  trackAddToWishlist(artworkId: string, title: string) {
    console.log('[Analytics] Add to Wishlist:', { artworkId, title });
  },
  trackRemoveFromWishlist(artworkId: string) {
    console.log('[Analytics] Remove from Wishlist:', { artworkId });
  },
  trackCheckoutBegin(itemCount: number, subtotal: number) {
    console.log('[Analytics] Begin Checkout:', { itemCount, subtotal });
  },
  trackPurchase(orderId: string, grandTotal: number) {
    console.log('[Analytics] Purchase Completed:', { orderId, grandTotal });
  },
};
export default AnalyticsService;
