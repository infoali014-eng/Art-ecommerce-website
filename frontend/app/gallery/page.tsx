import React, { Suspense } from 'react';

import { PageWrapper } from '@/components/layout/PageWrapper';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/sections/Navbar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

import Loading from '../loading';

import GalleryContent from './GalleryContent';

export const metadata = {
  title: 'Gallery Catalog | AURA Art Gallery',
  description:
    'Browse our complete catalog of bespoke paintings, ink calligraphy, and architectural sketches.',
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <PageWrapper className="pt-8">
        <Suspense fallback={<Loading />}>
          <GalleryContent />
        </Suspense>
      </PageWrapper>
      <Footer />
    </>
  );
}
