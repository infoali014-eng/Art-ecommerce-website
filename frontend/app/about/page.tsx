import React from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24">
        <Section padding="lg">
          <Container className="max-w-4xl">
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4 text-center">
              OUR STORY
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-center tracking-wide mb-12">
              The Essence of AURA
            </h1>
            <div className="w-12 h-[1px] bg-accent mx-auto mb-12" />

            <div className="space-y-8 font-sans text-sm text-secondary font-light leading-relaxed tracking-wide">
              <p>
                Founded in 2026, AURA is an editorial art gallery designed for collectors, designers, and interior architects who seek fine, minimalist aesthetics. We bridge the gap between traditional fine craftsmanship and contemporary living spaces.
              </p>
              <p>
                Every piece in our gallery is curated under strict museum-grade guidelines. From bespoke original oil paintings and acrylic experiments to historic brush ink calligraphy and architectural sketches, AURA stands as a testament to quiet luxury and architectural harmony.
              </p>
              <p className="italic text-primary font-medium font-cormorant text-lg text-center my-12">
                "Art should not demand attention; it should command space through its silent presence."
              </p>
              <p>
                We believe that modern spaces deserve art that reflects intentional living. By working directly with select local and international masters, we offer both a readymade collection of original works and a highly customized commission pipeline for private acquisitions.
              </p>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}
