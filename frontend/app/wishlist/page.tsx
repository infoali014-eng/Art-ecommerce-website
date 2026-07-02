'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowLeft, Eye, Heart, Share2, ShoppingBag, Trash2 } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useWishlist } from '@/hooks/useWishlist';
import { ArtworkService } from '@/services/artwork.service';
import { formatCurrency } from '@/utils/formatCurrency';

import { Artwork } from '@/types';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem, setIsCartOpen } = useCart();
  const { addToast } = useToast();

  const allArtworks = ArtworkService.getAllArtworks();

  // Map lightweight storage items back to full artwork models
  const wishlistArtworks = wishlist
    .map((item) => {
      const artwork = allArtworks.find((art) => art.id === item.artworkId);
      return {
        ...item,
        artwork,
      };
    })
    .filter((item) => item.artwork !== undefined);

  const handleRemove = (artworkId: string, title: string) => {
    removeFromWishlist(artworkId);
    addToast(`Removed "${title}" from your wishlist.`, 'info');
  };

  const handleMoveToCart = (artwork: Artwork) => {
    // Add to cart with default framing "none"
    addItem(artwork, 'none', 1);
    removeFromWishlist(artwork.id);
    addToast(`"${artwork.title}" moved to shopping bag.`, 'success');
    setIsCartOpen(true); // Auto-open cart drawer
  };

  const handleShare = (slug: string, title: string) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/gallery/${slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        addToast(`Link for "${title}" copied to clipboard!`, 'success');
      })
      .catch((e) => {
        console.error(e);
        addToast('Failed to copy link.', 'error');
      });
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs customLabels={{ wishlist: 'Saved Gallery Items' }} />

      <PageWrapper className="pt-8">
        <Section padding="none" className="pb-24 font-sans">
          <Container>
            {/* Header Section */}
            <div className="mb-12">
              <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-2">
                YOUR WISHLIST
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl font-light text-primary tracking-wide">
                Saved Artworks
              </h1>
              <div className="w-12 h-[1px] bg-accent mt-4" />
            </div>

            {wishlistArtworks.length === 0 ? (
              /* Empty Wishlist View */
              <div className="border border-primary/5 bg-white py-24 px-6 text-center max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-primary/5 bg-background flex items-center justify-center text-secondary/40 mb-6">
                  <Heart className="w-6 h-6 stroke-[1.2]" />
                </div>
                <h3 className="font-cormorant text-2xl font-light text-primary mb-3">
                  Wishlist is Empty
                </h3>
                <p className="font-sans text-xs text-secondary font-light max-w-xs mb-8 leading-relaxed">
                  You have not saved any masterworks to your wishlist yet. Explore the catalog to
                  select pieces.
                </p>
                <Link href="/gallery">
                  <Button variant="primary" size="sm">
                    Browse Gallery
                  </Button>
                </Link>
              </div>
            ) : (
              /* Active Wishlist Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlistArtworks.map(({ id, artwork }) => {
                  if (!artwork) return null;

                  return (
                    <div
                      key={id}
                      className="group bg-white border border-primary/5 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:border-accent/30 h-full"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-background">
                        <Image
                          src={artwork.images[0]}
                          alt={artwork.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Quick Actions Hover overlay */}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                          <Link href={`/gallery/${artwork.slug}`}>
                            <button
                              className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleMoveToCart(artwork)}
                            disabled={artwork.availability === 'sold'}
                            className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer disabled:opacity-50"
                            title="Acquire Masterwork"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(artwork.slug, artwork.title)}
                            className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
                            title="Copy Share Link"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Availability badge overlay */}
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

                      {/* Info Panel */}
                      <div className="p-5 flex flex-col justify-between flex-grow">
                        <div className="mb-4">
                          <Link href={`/gallery/${artwork.slug}`}>
                            <h3 className="font-cormorant text-lg font-medium text-primary tracking-wide mb-1 group-hover:text-accent transition-colors duration-300">
                              {artwork.title}
                            </h3>
                          </Link>
                          <p className="font-sans text-xs text-secondary mb-2 italic">
                            By {artwork.artist}
                          </p>
                          <div className="text-[10px] text-secondary font-sans uppercase tracking-wider flex items-center gap-2">
                            <span>{artwork.medium}</span>
                            <span className="w-1 h-1 rounded-full bg-primary/10" />
                            <span>{artwork.dimensions}</span>
                          </div>
                        </div>

                        <div className="border-t border-primary/5 pt-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-sm font-semibold text-primary">
                              {formatCurrency(artwork.price)}
                            </span>
                            <button
                              onClick={() => handleRemove(artwork.id, artwork.title)}
                              className="text-secondary/40 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <Link href={`/gallery/${artwork.slug}`} className="w-full">
                              <Button variant="outline" size="sm" fullWidth>
                                View Art
                              </Button>
                            </Link>
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={artwork.availability === 'sold'}
                              onClick={() => handleMoveToCart(artwork)}
                              fullWidth
                            >
                              Acquire
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Back anchor */}
            {wishlistArtworks.length > 0 && (
              <div className="pt-12">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors font-medium font-sans"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Gallery</span>
                </Link>
              </div>
            )}
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}
