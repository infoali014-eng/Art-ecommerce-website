'use client';

import React, { createContext, useEffect, useState } from 'react';

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

  useEffect(() => {
    const items = WishlistService.getWishlistItems();
    setWishlist(items);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    WishlistService.saveWishlistItems(wishlist);
  }, [wishlist, isInitialized]);

  const toggleWishlist = (artworkId: string, title: string = 'Artwork') => {
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
