import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 min-h-[65vh] flex items-center">
        <Section padding="lg">
          <Container className="text-center">
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4">
              ERROR 404
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light tracking-wide mb-6">
              Lost in Translation
            </h1>
            <p className="font-sans text-sm text-secondary font-light max-w-md mx-auto mb-10 leading-relaxed">
              The page you are looking for does not exist in our curation. It may have been archived, renamed, or moved to a private collection.
            </p>
            <Link href="/">
              <Button variant="outline">
                Return to Gallery
              </Button>
            </Link>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}
