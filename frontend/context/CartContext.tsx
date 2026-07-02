'use client';

import React, { createContext, useEffect, useMemo, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { AnalyticsService } from '@/services/analytics.service';
import { CartService } from '@/services/cart.service';
import { calculateGrandTotal } from '@/utils/calculateGrandTotal';
import { calculateShipping } from '@/utils/calculateShipping';
import { calculateSubtotal } from '@/utils/calculateSubtotal';
import { calculateTax } from '@/utils/calculateTax';

import { Artwork, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (artwork: Artwork, frameOption: string, quantity?: number, notes?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  // Load initial cart and configure auth state listeners
  useEffect(() => {
    const initCart = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id || null;
        setUserId(currentUserId);

        const initialItems = await CartService.getCartItems(currentUserId || undefined);
        setItems(initialItems);
      } catch (e) {
        console.error('Failed to initialize cart:', e);
      } finally {
        setIsInitialized(true);
      }
    };

    initCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUserId = session?.user?.id || null;
      setUserId(currentUserId);

      if (event === 'SIGNED_IN' && session?.user) {
        // Read guest cart from localStorage prior to merging
        const localItems = await CartService.getCartItems(undefined);
        if (localItems.length > 0) {
          console.log('[Cart] Merging guest cart with user database account...');
          await CartService.mergeGuestCart(localItems, session.user.id);
        }
        const databaseItems = await CartService.getCartItems(session.user.id);
        setItems(databaseItems);
      } else if (event === 'SIGNED_OUT') {
        // Reset to guest items (should be empty after logouts)
        const guestItems = await CartService.getCartItems(undefined);
        setItems(guestItems);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Persist items on changes
  useEffect(() => {
    if (!isInitialized) return;
    const persistCart = async () => {
      await CartService.saveCartItems(items, userId || undefined);
    };
    persistCart();
  }, [items, isInitialized, userId]);

  const addItem = (artwork: Artwork, frameOption: string, quantity = 1, notes = '') => {
    setItems((prev) => {
      const id = `${artwork.id}_${frameOption}`;
      const existingIndex = prev.findIndex((item) => item.id === id);

      AnalyticsService.trackAddToCart(artwork.id, artwork.title, artwork.price, frameOption);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id,
        artworkId: artwork.id,
        title: artwork.title,
        price: artwork.price,
        quantity,
        image: artwork.images[0],
        frameOption,
        notes,
        addedAt: new Date().toISOString(),
      };

      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        AnalyticsService.trackRemoveFromCart(id, target.title);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const shipping = useMemo(() => calculateShipping(subtotal), [subtotal]);
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const grandTotal = useMemo(
    () => calculateGrandTotal(subtotal, shipping, tax),
    [subtotal, shipping, tax]
  );

  const itemCount = useMemo(() => items.reduce((count, item) => count + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        tax,
        grandTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;
