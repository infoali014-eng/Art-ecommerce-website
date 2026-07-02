'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { Container } from '../layout/Container';
import paintingsImg from '@/assets/gallery/paintings_category.png';
import calligraphyImg from '@/assets/gallery/calligraphy_category.png';
import sketchesImg from '@/assets/gallery/sketches_category.png';

const categories = [
  {
    title: 'Paintings',
    subtitle: 'Original Art',
    description: 'Masterfully crafted oil and acrylic paintings on premium canvas.',
    image: paintingsImg,
    href: '/gallery/paintings',
  },
  {
    title: 'Calligraphy',
    subtitle: 'Contemporary Ink',
    description: 'Expressive brushwork combining traditional scripts and modern forms.',
    image: calligraphyImg,
    href: '/gallery/calligraphy',
  },
  {
    title: 'Sketches',
    subtitle: 'Pencil & Graphite',
    description: 'Detailed structural sketches capturing light and fine line shadows.',
    image: sketchesImg,
    href: '/gallery/sketches',
  },
];

export const FeaturedCategories: React.FC = () => {
  return (
    <Section padding="md" className="bg-[#FAF7F2]">
      <Container>
        <div className="text-center mb-16">
          <span className="text-accent font-sans text-xs uppercase tracking-[0.2em] font-medium block mb-3">
            CURATED CATEGORIES
          </span>
          <h2 className="font-cormorant text-3xl md:text-5xl font-light text-primary tracking-wide">
            Explore Our Mediums
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link key={category.title} href={category.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer border border-primary/5 bg-white shadow-xs"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-85" />

                {/* Text Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end text-background z-10">
                  <span className="text-accent font-sans text-[10px] uppercase tracking-widest font-semibold mb-2">
                    {category.subtitle}
                  </span>
                  <h3 className="font-cormorant text-2xl font-light tracking-wide mb-2 group-hover:text-accent transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="font-sans text-[11px] text-background/80 font-light max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 ease-in-out tracking-wide">
                    {category.description}
                  </p>

                  <div className="mt-4 overflow-hidden">
                    <span className="inline-block font-sans text-[10px] uppercase tracking-widest text-accent border-b border-accent/30 pb-0.5 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      View Collection &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
};
export default FeaturedCategories;
