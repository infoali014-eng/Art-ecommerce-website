import React from 'react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';

export default function CollectionsPage() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24">
        <Section padding="none">
          <Container className="pt-16 pb-8 text-center">
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4">
              EDITORIAL CURATIONS
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light tracking-wide mb-6">
              Our Curated Collections
            </h1>
            <p className="font-sans text-sm text-secondary font-light max-w-xl mx-auto leading-relaxed">
              Explore our current seasonal selections. Each collection is organized by our head
              curator to express cohesive structural themes, palettes, and light interactions
              suitable for residential and public exhibition.
            </p>
            <div className="w-12 h-[1px] bg-accent mx-auto mt-8" />
          </Container>
        </Section>
        <FeaturedCollection />
      </PageWrapper>
      <Footer />
    </>
  );
}
