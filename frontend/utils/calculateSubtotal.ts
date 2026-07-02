import { CartItem } from '@/types';

export const FRAME_PRICES: Record<string, number> = {
  none: 0,
  black: 250,
  walnut: 250,
  gold: 350,
  white: 250,
};

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const frameCost = FRAME_PRICES[item.frameOption] ?? 0;
    return total + (item.price + frameCost) * item.quantity;
  }, 0);
}
export default calculateSubtotal;
