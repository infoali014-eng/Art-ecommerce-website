'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import heroBg from '@/assets/hero/background.png';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={heroBg}
          alt="AURA Fine Art Gallery"
          fill
          priority
          className="object-cover object-center brightness-[0.65] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-primary/40" />
      </div>

      <Container className="relative z-10 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-accent font-sans text-xs uppercase tracking-[0.3em] mb-6 font-medium"
          >
            AURA FINE ART GALLERY
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-4xl sm:text-6xl md:text-7xl font-light text-background leading-[1.1] mb-8 tracking-wide"
          >
            Where Masterpieces Find <br className="hidden sm:inline" />
            <span className="italic">Their Quiet Resonance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-sans text-sm md:text-base text-background/85 font-light max-w-xl mb-12 tracking-wide leading-relaxed"
          >
            Experience a curated selection of fine oil paintings, delicate calligraphy, and structural sketches designed for modern luxury spaces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/gallery" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Gallery
              </Button>
            </Link>
            <Link href="/custom-order" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                Order Custom Artwork
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
export default Hero;
