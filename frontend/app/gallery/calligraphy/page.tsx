import React, { Suspense } from 'react';

import { PageWrapper } from '@/components/layout/PageWrapper';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

import Loading from '../../loading';
import GalleryContent from '../GalleryContent';

export const metadata = {
  title: 'Fine Calligraphy | Manan Art Gallery',
  description: 'Exquisite brush ink scripts, Japanese Sumi studies, and calligraphy prints.',
};

export default function CalligraphyPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <PageWrapper className="pt-8">
        <div className="text-center pt-8 pb-12 font-sans">
          <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium block mb-3">
            EXQUISITE INK SCRIPTS
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl font-light text-primary tracking-wide">
            Fine Calligraphy
          </h1>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-6" />
        </div>
        <Suspense fallback={<Loading />}>
          <GalleryContent categorySlug="calligraphy" hideCategoryFilter />
        </Suspense>
      </PageWrapper>
      <Footer />
    </>
  );
}
