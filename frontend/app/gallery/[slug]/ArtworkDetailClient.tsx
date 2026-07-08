'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Heart, HelpCircle, ShieldCheck, Truck } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArtworkCard } from '@/components/ui/ArtworkCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/useToast';
import { FRAME_PRICES } from '@/utils/calculateSubtotal';

import { Artist, Artwork } from '@/types';

interface ArtworkDetailClientProps {
  artwork: Artwork;
  artist: Artist | null;
  relatedArtworks: Artwork[];
}

export const ArtworkDetailClient: React.FC<ArtworkDetailClientProps> = ({
  artwork,
  artist,
  relatedArtworks,
}) => {
  const [activeImage, setActiveImage] = useState(artwork.images[0]);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [frameOption, setFrameOption] = useState('none');
  const [inquireSuccess, setInquireSuccess] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const favorited = isFavorite(artwork.id);
  const router = useRouter();

  const handleBuyNow = () => {
    router.push(`/checkout/${artwork.slug}?frame=${frameOption}`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(artwork.id);
    if (favorited) {
      addToast(`Removed "${artwork.title}" from your wishlist.`, 'info');
    } else {
      addToast(`Saved "${artwork.title}" to your wishlist.`, 'success');
    }
  };

  const formatPrice = (price: number) => {
    const frameCost = FRAME_PRICES[frameOption] ?? 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price + frameCost);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addItem(artwork, frameOption, 1);
    addToast(`Added "${artwork.title}" to your shopping bag.`, 'success');
    setIsCartOpen(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquireSuccess(true);
    setTimeout(() => setInquireSuccess(false), 3000);
  };

  return (
    <Section padding="none" className="pb-24 font-sans text-primary">
      <Container>
        {/* Navigation Action */}
        <div className="mb-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gallery</span>
          </Link>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          {/* Left Column: Media display */}
          <div className="space-y-4">
            {/* Main Picture Zoomer */}
            <div
              className="relative aspect-[3/4] w-full overflow-hidden cursor-crosshair border border-primary/5 bg-background"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={activeImage}
                alt={artwork.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-200"
                style={
                  showZoom
                    ? {
                        transform: 'scale(1.6)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />
            </div>

            {/* Thumbnail Selection Grid */}
            {artwork.images.length > 1 && (
              <div className="flex gap-3">
                {artwork.images.map((img) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[3/4] w-20 overflow-hidden border cursor-pointer ${
                      activeImage === img
                        ? 'border-accent'
                        : 'border-primary/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={artwork.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <Badge variant="accent" className="capitalize">
                  {artwork.category}
                </Badge>
                {artwork.isOriginal && (
                  <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                    Original Artwork
                  </span>
                )}
              </div>
              <h1 className="font-cormorant text-4xl sm:text-5xl font-light leading-tight tracking-wide mb-2">
                {artwork.title}
              </h1>
              <p className="text-secondary italic text-sm">By {artwork.artist}</p>
            </div>

            {/* Price section */}
            <div className="flex items-center gap-6">
              <span className="text-2xl font-sans font-semibold text-primary">
                {formatPrice(artwork.price)}
              </span>
              <button
                onClick={handleToggleFavorite}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors duration-250 cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-accent text-accent' : ''}`} />
                <span>{favorited ? 'In Favorites' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* framing optional selectors */}
            {artwork.framingAvailable && (
              <div className="p-4 border border-primary/5 bg-white space-y-3">
                <div className="text-xs">
                  <label className="font-semibold text-primary block mb-2">
                    Select Premium Frame Style
                  </label>
                  <select
                    value={frameOption}
                    onChange={(e) => setFrameOption(e.target.value)}
                    className="w-full bg-background border border-primary/10 px-3 py-2.5 text-xs focus:outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="none">No Frame (Raw Canvas)</option>
                    <option value="black">Premium Black Oak Float Frame (+$250)</option>
                    <option value="walnut">Natural Walnut Float Frame (+$250)</option>
                    <option value="gold">Museum Gold Leaf Frame (+$350)</option>
                    <option value="white">Minimal Matte White Frame (+$250)</option>
                  </select>
                </div>
                <p className="text-[10px] text-secondary font-light leading-relaxed">
                  Custom handcrafted frame matching museum-quality preservation standards. Adds 3
                  days to shipping delivery.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleBuyNow}
                disabled={artwork.availability === 'sold'}
                className="flex-grow"
              >
                {artwork.availability === 'sold' ? 'Sold Out' : 'Buy Now'}
              </Button>
            </div>

            {/* Delivery specs badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
              <div className="flex items-center gap-3 text-xs text-secondary font-light">
                <Truck className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <span className="block font-semibold text-primary">Estimated Delivery</span>
                  <span>{artwork.estimatedDelivery}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-secondary font-light">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <span className="block font-semibold text-primary">Authentication</span>
                  <span>COA Included</span>
                </div>
              </div>
            </div>

            {/* Specs list */}
            <div>
              <h3 className="font-cormorant text-xl font-light mb-4 border-b border-primary/5 pb-2">
                Specifications
              </h3>
              <dl className="grid grid-cols-2 gap-y-3 text-xs">
                <dt className="text-secondary uppercase tracking-wider">Medium</dt>
                <dd className="text-primary font-medium text-right">{artwork.medium}</dd>

                <dt className="text-secondary uppercase tracking-wider">Dimensions</dt>
                <dd className="text-primary font-medium text-right">{artwork.dimensions}</dd>

                <dt className="text-secondary uppercase tracking-wider">Orientation</dt>
                <dd className="text-primary font-medium text-right capitalize">
                  {artwork.orientation}
                </dd>

                <dt className="text-secondary uppercase tracking-wider">Availability</dt>
                <dd
                  className={`font-semibold text-right uppercase tracking-wider ${
                    artwork.availability === 'available'
                      ? 'text-emerald-600'
                      : artwork.availability === 'reserved'
                        ? 'text-amber-500'
                        : 'text-red-500'
                  }`}
                >
                  {artwork.availability}
                </dd>
              </dl>
            </div>

            {/* The Story */}
            <div className="space-y-4">
              <h3 className="font-cormorant text-xl font-light border-b border-primary/5 pb-2">
                The Story Behind the Piece
              </h3>
              <p className="text-xs text-secondary leading-relaxed font-light">{artwork.story}</p>
              <p className="text-[11px] text-secondary/70 leading-relaxed font-light italic">
                <strong className="text-primary font-semibold block not-italic mb-1">
                  Artistic Technique:
                </strong>
                {artwork.technique}
              </p>
            </div>
          </div>
        </div>

        {/* Artist Profile Card */}
        {artist && (
          <div className="bg-white border border-primary/5 p-8 lg:p-12 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border border-primary/5 mb-4">
                <Image
                  src={artist.avatar}
                  alt={artist.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-cormorant text-2xl font-light text-primary">{artist.name}</h3>
              <span className="text-[9px] uppercase tracking-widest text-accent font-semibold mt-1">
                Featured Master Artist
              </span>
            </div>

            <div className="md:col-span-2 space-y-4">
              <blockquote className="font-cormorant text-lg italic text-secondary border-l-2 border-accent/20 pl-4 py-1 leading-relaxed">
                &ldquo;{artist.statement}&rdquo;
              </blockquote>
              <p className="font-sans text-xs text-secondary leading-relaxed font-light">
                {artist.bio}
              </p>
            </div>
          </div>
        )}

        {/* Curator Private Inquiry */}
        <div className="bg-[#FAF7F2] border border-accent/10 p-8 lg:p-12 mb-24 max-w-3xl mx-auto text-center space-y-6">
          <HelpCircle className="w-8 h-8 text-accent mx-auto stroke-[1.2]" />
          <h3 className="font-cormorant text-2xl font-light text-primary tracking-wide">
            Acquisition Consultant Request
          </h3>
          <p className="font-sans text-xs text-secondary font-light max-w-lg mx-auto leading-relaxed">
            Interested in acquiring this piece but have questions regarding viewing, custom framing,
            tax, or private shipping arrangements? Contact our gallery curator office directly.
          </p>

          {inquireSuccess ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-100 text-xs font-sans uppercase tracking-wider max-w-md mx-auto">
              Inquiry Sent. Our consultant will contact you within 24 hours.
            </div>
          ) : (
            <form
              onSubmit={handleInquirySubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="bg-white border border-primary/10 px-4 py-3 text-xs font-sans focus:outline-none focus:border-accent w-full sm:flex-grow"
              />
              <button
                type="submit"
                className="bg-primary text-background hover:bg-accent hover:text-primary transition-all duration-300 px-6 py-3 text-xs uppercase tracking-wider font-semibold cursor-pointer shrink-0"
              >
                Inquire
              </button>
            </form>
          )}
        </div>

        {/* Related Artworks Grid */}
        {relatedArtworks.length > 0 && (
          <div>
            <h3 className="font-cormorant text-2xl font-light text-center tracking-wide mb-12">
              Related Masterworks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedArtworks.map((art) => (
                // Note: since this is related works, we can pass a mock quickview trigger
                <ArtworkCard
                  key={art.id}
                  artwork={art}
                  onQuickView={() => {
                    window.location.href = `/gallery/${art.slug}`;
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};
export default ArtworkDetailClient;
