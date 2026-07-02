import React from 'react';

import { PageWrapper } from '@/components/layout/PageWrapper';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import Footer from '@/components/sections/Footer';
import Hero from '@/components/sections/Hero';
import Navbar from '@/components/sections/Navbar';

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
