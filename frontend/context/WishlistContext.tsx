'use client';

import React, { createContext, useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { AnalyticsService } from '@/services/analytics.service';
import { WishlistService } from '@/services/wishlist.service';

import { WishlistItem } from '@/types';

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (artworkId: string, title?: string) => void;
  isInWishlist: (artworkId: string) => boolean;
  isWishlisted: (artworkId: string) => boolean;
  removeFromWishlist: (artworkId: string) => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  // Load initial wishlist and subscribe to auth state changes
  useEffect(() => {
    const initWishlist = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id || null;
        setUserId(currentUserId);

        const initialItems = await WishlistService.getWishlistItems(currentUserId || undefined);
        setWishlist(initialItems);
      } catch (e) {
        console.error('Failed to initialize wishlist:', e);
      } finally {
        setIsInitialized(true);
      }
    };

    initWishlist();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUserId = session?.user?.id || null;
      setUserId(currentUserId);

      if (event === 'SIGNED_IN' && session?.user) {
        const localItems = await WishlistService.getWishlistItems(undefined);
        if (localItems.length > 0) {
          console.log('[Wishlist] Merging guest wishlist with user account...');
          await WishlistService.mergeGuestWishlist(localItems, session.user.id);
        }
        const databaseItems = await WishlistService.getWishlistItems(session.user.id);
        setWishlist(databaseItems);
      } else if (event === 'SIGNED_OUT') {
        const guestItems = await WishlistService.getWishlistItems(undefined);
        setWishlist(guestItems);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Persist items on changes
  useEffect(() => {
    if (!isInitialized) return;
    const persistWishlist = async () => {
      await WishlistService.saveWishlistItems(wishlist, userId || undefined);
    };
    persistWishlist();
  }, [wishlist, isInitialized, userId]);

  const toggleWishlist = (artworkId: string, title = 'Artwork') => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.artworkId === artworkId);
      if (exists) {
        AnalyticsService.trackRemoveFromWishlist(artworkId);
        return prev.filter((item) => item.artworkId !== artworkId);
      } else {
        const newItem: WishlistItem = {
          id: artworkId,
          artworkId,
          addedAt: new Date().toISOString(),
        };
        AnalyticsService.trackAddToWishlist(artworkId, title);
        return [...prev, newItem];
      }
    });
  };

  const removeFromWishlist = (artworkId: string) => {
    setWishlist((prev) => {
      AnalyticsService.trackRemoveFromWishlist(artworkId);
      return prev.filter((item) => item.artworkId !== artworkId);
    });
  };

  const isInWishlist = (artworkId: string) => {
    return wishlist.some((item) => item.artworkId === artworkId);
  };

  const isWishlisted = (artworkId: string) => {
    return isInWishlist(artworkId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlisted,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
export default WishlistProvider;
