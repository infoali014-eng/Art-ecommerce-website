import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArtworkSkeleton } from '@/components/skeleton/ArtworkSkeleton';

export default function Loading() {
  return (
    <Section padding="lg" className="min-h-screen flex items-center justify-center bg-background">
      <Container>
        <div className="text-center mb-12 animate-pulse">
          <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-3">
            AURA GALLERY
          </span>
          <h2 className="font-cormorant text-2xl font-light text-primary tracking-wide">
            Curation in progress...
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArtworkSkeleton />
          <ArtworkSkeleton />
          <ArtworkSkeleton />
        </div>
      </Container>
    </Section>
  );
}
