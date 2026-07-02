'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Eye, Heart, ShoppingBag } from 'lucide-react';

import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/useToast';

import { Badge } from './Badge';

import { Artwork } from '@/types';

interface ArtworkCardProps {
  artwork: Artwork;
  onQuickView: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onQuickView }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(artwork.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const { addItem, setIsCartOpen } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(artwork, 'none', 1);
    addToast(`Added "${artwork.title}" to your shopping bag.`, 'success');
    setIsCartOpen(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(artwork.id);
    if (favorited) {
      addToast(`Removed "${artwork.title}" from your wishlist.`, 'info');
    } else {
      addToast(`Saved "${artwork.title}" to your wishlist.`, 'success');
    }
  };

  return (
    <div className="group bg-white border border-primary/5 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:border-accent/30 h-full">
      {/* Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-background">
        <Image
          src={artwork.images[0]}
          alt={artwork.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover actions */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <button
            onClick={() => onQuickView(artwork)}
            className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={artwork.availability === 'sold'}
            className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleFavorite}
            className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Add to Favorites"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${favorited ? 'fill-accent text-accent' : ''}`}
            />
          </button>
        </div>

        {/* Category Badge */}
        <Badge variant="accent" className="absolute top-4 left-4 z-10 capitalize">
          {artwork.category}
        </Badge>

        {/* Availability Badge */}
        {artwork.availability !== 'available' && (
          <span
            className={`absolute top-4 right-4 z-10 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 text-white ${
              artwork.availability === 'reserved' ? 'bg-amber-500' : 'bg-red-500'
            }`}
          >
            {artwork.availability}
          </span>
        )}
      </div>

      {/* Text Details */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="mb-4">
          <Link href={`/gallery/${artwork.slug}`}>
            <h3 className="font-cormorant text-lg font-medium text-primary tracking-wide mb-1 group-hover:text-accent transition-colors duration-300">
              {artwork.title}
            </h3>
          </Link>
          <p className="font-sans text-xs text-secondary mb-2 italic">By {artwork.artist}</p>
          <div className="text-[10px] text-secondary font-sans uppercase tracking-wider flex items-center gap-2">
            <span>{artwork.medium}</span>
            <span className="w-1 h-1 rounded-full bg-primary/10" />
            <span>{artwork.dimensions}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-primary/5 pt-4">
          <span className="font-sans text-sm font-semibold text-primary">
            {formatPrice(artwork.price)}
          </span>
          <Link
            href={`/gallery/${artwork.slug}`}
            className="font-sans text-[10px] uppercase tracking-wider text-accent border-b border-accent/20 pb-0.5 hover:text-primary hover:border-primary transition-colors duration-250"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ArtworkCard;
