import React from 'react';

import { Container } from '@/components/layout/Container';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Section } from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24">
        <Section padding="lg">
          <Container className="max-w-4xl">
            <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-4 text-center">
              OUR HISTORY & HERITAGE
            </span>
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light text-center tracking-wide mb-12">
              Manan Art Gallery
            </h1>
            <div className="w-12 h-[1px] bg-accent mx-auto mb-12" />

            <div className="space-y-8 font-sans text-sm text-secondary font-light leading-relaxed tracking-wide">
              <p>
                Nestled in the cultural heartlands of Daska, Punjab, Pakistan, Manan Art Gallery is
                a premier destination dedicated to preserving and showcasing the finest traditions
                of Pakistani fine art, calligraphy, paintings, and master sketches. We stand as a
                bridge between age-old regional craftsmanship and contemporary architectural
                interior designs.
              </p>
              <p>
                Our curated collections feature original oil paintings, acrylic masterworks, and
                classical Arabic brush script calligraphy crafted by local and national masters.
                Every stroke is created with meticulous detail and museum-grade preservation
                standards, ensuring that each piece commands a silent but powerful presence in
                private collections around the world.
              </p>
              <p className="italic text-primary font-medium font-cormorant text-lg text-center my-12">
                &ldquo;Art is not a mere object; it is the silent echo of our heritage and the
                intentional presence in our spaces.&rdquo;
              </p>
              <p>
                We believe that modern spaces deserve meaningful, handcrafted art. By working
                directly with talented Pakistani artists, Manan Art Gallery provides both
                ready-to-hang original gallery pieces and a personalized custom commission pipeline
                for private collectors looking for unique, customized masterstrokes.
              </p>
            </div>
          </Container>
        </Section>
      </PageWrapper>
      <Footer />
    </>
  );
}
