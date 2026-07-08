'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';

import { ArtworkSkeleton } from '@/components/skeleton/ArtworkSkeleton';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/useToast';
import { ArtworkService } from '@/services/artwork.service';

import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

import { Artwork } from '@/types';

export const FeaturedCollection: React.FC = () => {
  const router = useRouter();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToast } = useToast();

  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const data = await ArtworkService.getFeaturedArtworks();
        setFeaturedArtworks(data);
      } catch (e) {
        console.error('[FeaturedCollection] Error fetching featured items:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Section padding="md" className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-3">
            FINE ART ACQUISITIONS
          </span>
          <h2 className="font-cormorant text-3xl md:text-5xl font-light text-primary tracking-wide">
            Featured Collection
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-6" />
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ArtworkSkeleton key={i} />)
            : featuredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card hoverable className="group h-full flex flex-col justify-between">
                    {/* Image Wrapper */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-background">
                      <Image
                        src={artwork.images[0]}
                        alt={artwork.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedArtwork(artwork)}
                          className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
                          aria-label="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const favorited = isFavorite(artwork.id);
                            toggleFavorite(artwork.id);
                            if (favorited) {
                              addToast(`Removed "${artwork.title}" from your wishlist.`, 'info');
                            } else {
                              addToast(`Saved "${artwork.title}" to your wishlist.`, 'success');
                            }
                          }}
                          className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
                          aria-label="Add to Favorites"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFavorite(artwork.id) ? 'fill-accent text-accent' : ''
                            }`}
                          />
                        </button>
                      </div>
                      {/* Category Badge */}
                      <Badge variant="accent" className="absolute top-4 left-4">
                        {artwork.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div className="mb-4">
                        <h3 className="font-cormorant text-lg font-medium text-primary tracking-wide mb-1">
                          {artwork.title}
                        </h3>
                        <p className="font-sans text-xs text-secondary mb-2 italic">
                          {artwork.artist}
                        </p>
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
                        <button
                          onClick={() => setSelectedArtwork(artwork)}
                          className="font-sans text-[10px] uppercase tracking-wider text-accent border-b border-accent/20 pb-0.5 hover:text-primary hover:border-primary transition-colors duration-250 cursor-pointer"
                        >
                          Acquire &rarr;
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
        </div>
      </Container>

      {/* Quick View Modal */}
      <Modal
        isOpen={selectedArtwork !== null}
        onClose={() => {
          setSelectedArtwork(null);
        }}
        title="Artwork Profile"
        size="lg"
      >
        {selectedArtwork && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Artwork Image */}
            <div className="relative aspect-[3/4] w-full bg-background border border-primary/5">
              <Image
                src={selectedArtwork.images[0]}
                alt={selectedArtwork.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Artwork Details */}
            <div className="flex flex-col justify-between">
              <div>
                <Badge variant="accent" className="mb-3">
                  {selectedArtwork.category}
                </Badge>
                <h2 className="font-cormorant text-3xl font-light text-primary tracking-wide mb-1">
                  {selectedArtwork.title}
                </h2>
                <p className="font-sans text-sm text-secondary italic mb-4">
                  By {selectedArtwork.artist} ({selectedArtwork.year})
                </p>
                <div className="text-xl font-sans font-semibold text-accent mb-6">
                  {formatPrice(selectedArtwork.price)}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-primary/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary font-sans uppercase tracking-wider">
                      Medium
                    </span>
                    <span className="text-primary font-medium">{selectedArtwork.medium}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary font-sans uppercase tracking-wider">
                      Dimensions
                    </span>
                    <span className="text-primary font-medium">{selectedArtwork.dimensions}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary font-sans uppercase tracking-wider">
                      Status
                    </span>
                    <span className="text-primary font-medium text-emerald-600 font-semibold tracking-wide">
                      Available
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs text-secondary leading-relaxed mb-8">
                  {selectedArtwork.description}
                </p>
              </div>

              {/* Buy Now Action */}
              <div className="pt-6">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => router.push(`/checkout/${selectedArtwork.slug}`)}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
};
export default FeaturedCollection;
