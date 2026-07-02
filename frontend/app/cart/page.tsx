import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 min-h-[65vh] flex items-center">
        <Section padding="lg">
          <Container className="text-center">
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4">
              SHOPPING BAG
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light tracking-wide mb-6">
              Your Bag is Empty
            </h1>
            <p className="font-sans text-sm text-secondary font-light max-w-md mx-auto mb-10 leading-relaxed">
              You have not added any masterworks to your bag yet. Browse our current catalog to discover fine paintings, calligraphy, and sketches.
            </p>
            <Link href="/gallery">
              <Button variant="primary">
                Browse Gallery
              </Button>
            </Link>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}
