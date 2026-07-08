'use client';

import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

import { Artwork } from '@/types';

interface QuickViewModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ artwork, isOpen, onClose }) => {
  const router = useRouter();

  if (!artwork) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyNow = () => {
    onClose();
    router.push(`/checkout/${artwork.slug}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Artwork Profile" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Display */}
        <div className="relative aspect-[3/4] w-full bg-background border border-primary/5">
          <Image
            src={artwork.images[0] || artwork.images[0]}
            alt={artwork.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Content Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <Badge variant="accent" className="mb-2">
                {artwork.category}
              </Badge>
              <h2 className="font-cormorant text-3xl font-light text-primary tracking-wide mb-1 leading-tight">
                {artwork.title}
              </h2>
              <p className="font-sans text-xs text-secondary italic">
                By {artwork.artist} ({artwork.year})
              </p>
            </div>

            <div className="text-xl font-sans font-semibold text-accent">
              {formatPrice(artwork.price)}
            </div>

            <div className="space-y-2.5 pb-4 border-b border-primary/5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-secondary uppercase tracking-wider">Medium</span>
                <span className="text-primary font-medium">{artwork.medium}</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-secondary uppercase tracking-wider">Dimensions</span>
                <span className="text-primary font-medium">{artwork.dimensions}</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-secondary uppercase tracking-wider">Orientation</span>
                <span className="text-primary font-medium capitalize">{artwork.orientation}</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-secondary uppercase tracking-wider">Estimated Shipping</span>
                <span className="text-primary font-medium">{artwork.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-secondary uppercase tracking-wider">Status</span>
                <span
                  className={`font-semibold uppercase tracking-wider ${
                    artwork.availability === 'available'
                      ? 'text-emerald-600'
                      : artwork.availability === 'reserved'
                        ? 'text-amber-500'
                        : 'text-red-500'
                  }`}
                >
                  {artwork.availability === 'available'
                    ? 'In Stock'
                    : artwork.availability === 'reserved'
                      ? 'Reserved'
                      : 'Sold'}
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-secondary leading-relaxed font-light">
              {artwork.description}
            </p>
          </div>

          {/* Form Actions */}
          <div className="mt-6 pt-4 border-t border-primary/5">
            <Button
              variant="primary"
              fullWidth
              disabled={artwork.availability === 'sold'}
              onClick={handleBuyNow}
            >
              {artwork.availability === 'sold' ? 'Sold Out' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default QuickViewModal;
