import React from 'react';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import Footer from '@/components/sections/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function Home() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        <Hero />
        <FeaturedCategories />
        <FeaturedCollection />
      </PageWrapper>
      <Footer />
    </>
  );
}
