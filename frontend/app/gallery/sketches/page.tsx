'use client';

import React, { useState } from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ARTWORKS } from '@/constants/artworks';
import { Artwork } from '@/types';
import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';

export default function SketchesPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [inquireSuccess, setInquireSuccess] = useState(false);

  const filteredArtworks = ARTWORKS.filter(art => art.category === 'Sketches');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquireSuccess(true);
    setTimeout(() => {
      setInquireSuccess(false);
      setSelectedArtwork(null);
    }, 2500);
  };

  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24">
        <Section padding="sm">
          <Container className="text-center pt-12">
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4">
              GRAPHITE & CHARCOAL
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light tracking-wide mb-8">
              Fine Sketches Collection
            </h1>
            <p className="font-sans text-sm text-secondary font-light max-w-xl mx-auto leading-relaxed mb-10">
              Browse our selection of highly detailed architectural pencil sketches, charcoal portrait studies, and geometric graphite designs.
            </p>
            <div className="w-12 h-[1px] bg-accent mx-auto" />
          </Container>
        </Section>

        {/* Gallery Grid */}
        <Section padding="none" className="pb-24">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtworks.map((artwork, index) => (
                <Card key={artwork.id} hoverable className="group h-full flex flex-col justify-between">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-background">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => setSelectedArtwork(artwork)}
                        className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
                        aria-label="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="bg-background text-primary p-2.5 rounded-full shadow-lg hover:text-accent transition-colors duration-200 cursor-pointer"
                        aria-label="Add to Favorites"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <Badge variant="accent" className="absolute top-4 left-4">
                      {artwork.category}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="font-cormorant text-xl font-medium text-primary tracking-wide mb-1">
                      {artwork.title}
                    </h3>
                    <p className="font-sans text-xs text-secondary mb-3 italic">
                      {artwork.artist}
                    </p>
                    <div className="text-[10px] text-secondary font-sans uppercase tracking-wider flex items-center gap-2 mb-4">
                      <span>{artwork.medium}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/10" />
                      <span>{artwork.dimensions}</span>
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
              ))}
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />

      {/* Quick View Modal */}
      <Modal
        isOpen={selectedArtwork !== null}
        onClose={() => {
          setSelectedArtwork(null);
          setInquireSuccess(false);
        }}
        title="Artwork Profile"
        size="lg"
      >
        {selectedArtwork && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-[3/4] w-full bg-background border border-primary/5">
              <Image
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

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
                    <span className="text-secondary font-sans uppercase tracking-wider">Medium</span>
                    <span className="text-primary font-medium">{selectedArtwork.medium}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary font-sans uppercase tracking-wider">Dimensions</span>
                    <span className="text-primary font-medium">{selectedArtwork.dimensions}</span>
                  </div>
                </div>

                <p className="font-sans text-xs text-secondary leading-relaxed mb-8">
                  {selectedArtwork.description}
                </p>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {inquireSuccess ? (
                  <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 text-xs font-sans text-center uppercase tracking-wider">
                    Inquiry Sent. Our Curator will contact you shortly.
                  </div>
                ) : (
                  <>
                    <h4 className="font-cormorant text-base text-primary mb-2 tracking-wide font-medium">
                      Request Acquisition Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        className="bg-white border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        className="bg-white border border-primary/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-accent"
                      />
                    </div>
                    <Button variant="primary" size="sm" type="submit" fullWidth>
                      Submit Curator Inquiry
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
